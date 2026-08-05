import express from 'express';
import cors from 'cors';
import JSZip from 'jszip';
import crypto from 'crypto';
import { isCertificatesAvailable, signAndPackagePass } from './signer';

const app = express();
const PORT = Number(process.env.PORT) || 8080;

// In-memory pass cache for direct HTTPS downloads (expires after 15 mins)
const passStore = new Map<string, { zipBuffer: Buffer; createdAt: number }>();

// Cleanup stale passes periodically
setInterval(() => {
  const now = Date.now();
  for (const [id, item] of passStore.entries()) {
    if (now - item.createdAt > 15 * 60 * 1000) {
      passStore.delete(id);
    }
  }
}, 5 * 60 * 1000);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.raw({ type: 'application/zip', limit: '10mb' }));

// Root health check
app.get('/', (_req, res) => {
  res.json({ service: 'PassCraft Signing Server', status: 'online' });
});

// Health & Cert Status Endpoint
app.get('/api/cert-status', (_req, res) => {
  const hasCerts = isCertificatesAvailable();
  res.json({
    status: 'online',
    hasCertificates: hasCerts,
    passTypeIdentifier: 'pass.com.passcraft.eventpass',
    teamIdentifier: '68QFVQ738K',
    message: hasCerts
      ? '✅ Apple Developer Certificates Loaded! 1-Click PKPass Signing Active.'
      : '⚠️ Certificates missing. Add PASS_PEM, PASS_KEY, WWDR_PEM environment variables.'
  });
});

// 1. Pass Signing API Endpoint (Raw ZIP input)
app.post('/api/sign-pass', async (req, res) => {
  try {
    const rawBuffer = req.body as Buffer;
    if (!rawBuffer || rawBuffer.length === 0) {
      return res.status(400).json({ error: 'Missing zip binary buffer in request body' });
    }
    const result = await signAndPackagePass(rawBuffer);
    res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
    res.setHeader('Content-Disposition', 'attachment; filename="pass.pkpass"');
    res.setHeader('X-Pass-Signed', result.signed ? 'true' : 'false');
    res.setHeader('X-Pass-Message', result.message);
    res.send(result.zipBuffer);
  } catch (err: any) {
    console.error('Error in /api/sign-pass:', err);
    res.status(500).json({ error: err?.message || 'Failed to process pass' });
  }
});

// 2. Direct HTTPS Pass Link Creator (For native iOS Safari Apple Wallet popup)
app.post('/api/pass/create-link', async (req, res) => {
  try {
    const rawBuffer = req.body as Buffer;
    if (!rawBuffer || rawBuffer.length === 0) {
      return res.status(400).json({ error: 'Missing zip binary buffer in request body' });
    }
    const result = await signAndPackagePass(rawBuffer);
    const passId = crypto.randomBytes(8).toString('hex');
    passStore.set(passId, { zipBuffer: result.zipBuffer, createdAt: Date.now() });

    const downloadUrl = `${req.protocol}://${req.get('host')}/api/pass/download/${passId}.pkpass`;
    res.json({
      success: true,
      passId,
      downloadUrl,
      signed: result.signed,
      message: result.message
    });
  } catch (err: any) {
    console.error('Error in /api/pass/create-link:', err);
    res.status(500).json({ error: err?.message || 'Failed to create pass link' });
  }
});

// 3. Direct HTTPS Pass Download Endpoint (iOS Safari opens Apple Wallet natively on this URL!)
app.get('/api/pass/download/:filename', (req, res) => {
  const filename = req.params.filename || '';
  const passId = filename.replace('.pkpass', '');
  const item = passStore.get(passId);

  if (!item) {
    return res.status(404).send('Pass link expired or not found. Please export again from PassCraft.');
  }

  res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
  res.setHeader('Content-Disposition', 'inline; filename="pass.pkpass"');
  res.setHeader('Cache-Control', 'no-cache');
  res.send(item.zipBuffer);
});

// Global Process Error Handlers (Prevents Railway container crashes on invalid cert input)
process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception in server process:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('⚠️ Unhandled Promise Rejection in server process:', reason);
});

const primaryPort = Number(process.env.PORT) || 3000;
const secondaryPort = 8080;

app.listen(primaryPort, () => {
  console.log(`🚀 PassCraft Signing Server started on primary port ${primaryPort}`);
  console.log(`📋 Cert status: ${isCertificatesAvailable() ? '✅ Certificates Present' : '⚠️ Certificates Missing'}`);
});

if (primaryPort !== secondaryPort) {
  try {
    const backupServer = express();
    backupServer.use(app);
    backupServer.listen(secondaryPort, () => {
      console.log(`🚀 PassCraft Signing Server backup listener on port ${secondaryPort}`);
    });
  } catch (err) {
    console.warn('Backup port 8080 already bound or unavailable:', err);
  }
}
