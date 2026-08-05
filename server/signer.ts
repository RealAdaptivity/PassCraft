import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import JSZip from 'jszip';
import forge from 'node-forge';

const CERTS_DIR = path.join(process.cwd(), 'certs');

export interface PassSignResult {
  signed: boolean;
  zipBuffer: Buffer;
  message: string;
}

// Robust PEM cert reader from env var (base64 or raw PEM) or local file
function getCertContent(envVar: string, filePath: string): string | null {
  let envVal = process.env[envVar];
  if (envVal) {
    let cleaned = envVal.trim();
    // Strip accidental PASS_PEM=, PASS_KEY=, WWDR_PEM= prefix
    cleaned = cleaned.replace(new RegExp(`^${envVar}=`, 'i'), '').trim();

    if (cleaned.includes('-----BEGIN')) {
      return cleaned;
    }
    try {
      const decoded = Buffer.from(cleaned.replace(/[\s\r\n]+/g, ''), 'base64').toString('utf-8');
      if (decoded.includes('-----BEGIN')) {
        return decoded;
      }
    } catch {
      // Fallback to raw value
    }
    return cleaned;
  }

  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  return null;
}

export function isCertificatesAvailable(): boolean {
  if (process.env.PASS_PEM && process.env.PASS_KEY && process.env.WWDR_PEM) {
    return true;
  }
  const passPem = path.join(CERTS_DIR, 'pass.pem');
  const passKey = path.join(CERTS_DIR, 'pass.key');
  const wwdrPem = path.join(CERTS_DIR, 'wwdr.pem');
  const passCer = path.join(CERTS_DIR, 'pass.cer');
  return (fs.existsSync(passPem) || fs.existsSync(passCer)) && 
          fs.existsSync(passKey) && 
          fs.existsSync(wwdrPem);
}

function createPkcs7SignatureNodeForge(manifestBuffer: Buffer, passPem: string, passKey: string, wwdrPem: string): Buffer {
  const p7 = forge.pkcs7.createSignedData();
  p7.content = forge.util.createBuffer(manifestBuffer.toString('binary'), 'raw');

  const signerCert = forge.pki.certificateFromPem(passPem);
  const signerKey = forge.pki.privateKeyFromPem(passKey);

  p7.addCertificate(signerCert);

  // Parse and add all intermediate & root CA certificates in chain
  const certBlocks = wwdrPem.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g) || [wwdrPem];
  certBlocks.forEach(c => {
    try {
      const cert = forge.pki.certificateFromPem(c);
      p7.addCertificate(cert);
    } catch (e) {
      console.warn('Failed parsing CA cert block:', e);
    }
  });

  p7.addSigner({
    key: signerKey,
    certificate: signerCert,
    digestAlgorithm: forge.pki.oids.sha1,
    authenticatedAttributes: [
      {
        type: forge.pki.oids.contentType,
        value: forge.pki.oids.data
      },
      {
        type: forge.pki.oids.messageDigest
      },
      {
        type: forge.pki.oids.signingTime,
        value: new Date()
      }
    ]
  });

  p7.sign({ detached: true });
  const der = forge.asn1.toDer(p7.toAsn1()).getBytes();
  return Buffer.from(der, 'binary');
}

export async function signAndPackagePass(unsignedZipBuffer: Buffer): Promise<PassSignResult> {
  if (!fs.existsSync(CERTS_DIR)) {
    fs.mkdirSync(CERTS_DIR, { recursive: true });
  }

  let passPemContent = getCertContent('PASS_PEM', path.join(CERTS_DIR, 'pass.pem'));
  const passKeyContent = getCertContent('PASS_KEY', path.join(CERTS_DIR, 'pass.key'));
  const wwdrPemContent = getCertContent('WWDR_PEM', path.join(CERTS_DIR, 'wwdr.pem'));

  const zip = await JSZip.loadAsync(unsignedZipBuffer);
  const manifestFile = zip.file('manifest.json');

  if (!manifestFile) {
    throw new Error('Invalid pass ZIP: manifest.json missing');
  }

  const manifestContent = await manifestFile.async('nodebuffer');
  let signatureBuffer: Buffer | null = null;

  if (passPemContent && passKeyContent && wwdrPemContent) {
    // 1. Try pure JavaScript PKCS7 signing first
    try {
      signatureBuffer = createPkcs7SignatureNodeForge(manifestContent, passPemContent, passKeyContent, wwdrPemContent);
      console.log('✅ Pass signed successfully using pure JS (node-forge)');
    } catch (forgeErr) {
      console.warn('Pure JS signing failed, trying OpenSSL CLI fallback:', forgeErr);

      // 2. Fallback to OpenSSL CLI
      const opensslBin = fs.existsSync('C:\\Program Files\\Git\\usr\\bin\\openssl.exe')
        ? '"C:\\Program Files\\Git\\usr\\bin\\openssl.exe"'
        : 'openssl';

      const tmpDir = process.env.TMPDIR || process.env.TEMP || '/tmp';
      const ts = Date.now();
      const tempPem = path.join(tmpDir, `pass_${ts}.pem`);
      const tempKey = path.join(tmpDir, `pass_${ts}.key`);
      const tempWwdr = path.join(tmpDir, `wwdr_${ts}.pem`);
      const tempManifest = path.join(tmpDir, `manifest_${ts}.json`);
      const tempSig = path.join(tmpDir, `signature_${ts}`);

      try {
        fs.writeFileSync(tempPem, passPemContent);
        fs.writeFileSync(tempKey, passKeyContent);
        fs.writeFileSync(tempWwdr, wwdrPemContent);
        fs.writeFileSync(tempManifest, manifestContent);

        const cmd = `${opensslBin} smime -sign -signer "${tempPem}" -inkey "${tempKey}" -certfile "${tempWwdr}" -in "${tempManifest}" -out "${tempSig}" -outform DER -binary`;
        execSync(cmd);

        if (fs.existsSync(tempSig)) {
          signatureBuffer = fs.readFileSync(tempSig);
          console.log('✅ Pass signed successfully using OpenSSL CLI');
        }
      } catch (opensslErr) {
        console.error('OpenSSL CLI signing also failed:', opensslErr);
      } finally {
        [tempPem, tempKey, tempWwdr, tempManifest, tempSig].forEach(f => {
          try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch {}
        });
      }
    }
  }

  if (signatureBuffer) {
    zip.file('signature', signatureBuffer);
    const finalZipBuffer = await zip.generateAsync({ type: 'nodebuffer', mimeType: 'application/vnd.apple.pkpass' });
    return {
      signed: true,
      zipBuffer: finalZipBuffer,
      message: 'Pass signed successfully with Apple Pass Certificate!'
    };
  } else {
    const unsignedFinal = await zip.generateAsync({ type: 'nodebuffer', mimeType: 'application/vnd.apple.pkpass' });
    return {
      signed: false,
      zipBuffer: unsignedFinal,
      message: 'Unsigned pass bundle (add PASS_PEM, PASS_KEY, WWDR_PEM env vars to enable signing)'
    };
  }
}
