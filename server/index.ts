import express from 'express';
import cors from 'cors';
import { isCertificatesAvailable, signAndPackagePass } from './signer';

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

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

// Pass Signing API Endpoint
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

app.listen(Number(PORT), HOST, () => {
  console.log(`🚀 PassCraft Signing Server started on ${HOST}:${PORT}`);
  console.log(`📋 Cert status: ${isCertificatesAvailable() ? '✅ Certificates Present' : '⚠️ Certificates Missing'}`);
});
