import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { isCertificatesAvailable, signAndPackagePass } from './signer';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.raw({ type: 'application/zip', limit: '10mb' }));

// Health & Cert Status Endpoint
app.get('/api/cert-status', (req, res) => {
  const hasCerts = isCertificatesAvailable();
  res.json({
    status: 'online',
    hasCertificates: hasCerts,
    passTypeIdentifier: 'pass.com.passcraft.eventpass',
    teamIdentifier: '68QFVQ738K',
    message: hasCerts 
      ? 'Apple Developer Certificates Loaded! 1-Click PKPass Signing Active.' 
      : 'Certificates missing in ./certs folder. Drop pass.p12 or pass.pem to enable automatic 1-click signing.'
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

app.listen(PORT, () => {
  console.log(`🚀 PassCraft Signing Server running on http://localhost:${PORT}`);
});
