import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import JSZip from 'jszip';
import crypto from 'crypto';

const CERTS_DIR = path.join(process.cwd(), 'certs');

export interface PassSignResult {
  signed: boolean;
  zipBuffer: Buffer;
  message: string;
}

export function isCertificatesAvailable(): boolean {
  const pemExist = fs.existsSync(path.join(CERTS_DIR, 'pass.pem')) && 
                   fs.existsSync(path.join(CERTS_DIR, 'pass.key')) && 
                   fs.existsSync(path.join(CERTS_DIR, 'wwdr.pem'));
  const p12Exist = fs.existsSync(path.join(CERTS_DIR, 'pass.p12'));
  return pemExist || p12Exist;
}

export async function signAndPackagePass(unsignedZipBuffer: Buffer, password: string = ''): Promise<PassSignResult> {
  if (!fs.existsSync(CERTS_DIR)) {
    fs.mkdirSync(CERTS_DIR, { recursive: true });
  }

  const passPem = path.join(CERTS_DIR, 'pass.pem');
  const passKey = path.join(CERTS_DIR, 'pass.key');
  const wwdrPem = path.join(CERTS_DIR, 'wwdr.pem');
  const passP12 = path.join(CERTS_DIR, 'pass.p12');

  // Convert p12 to pem/key if needed
  if (!fs.existsSync(passPem) && fs.existsSync(passP12)) {
    try {
      execSync(`openssl pkcs12 -in "${passP12}" -clcerts -nokeys -out "${passPem}" -passin pass:${password}`);
      execSync(`openssl pkcs12 -in "${passP12}" -nocerts -nodes -out "${passKey}" -passin pass:${password}`);
    } catch (err) {
      console.warn('Failed to extract PEM/KEY from pass.p12 using OpenSSL:', err);
    }
  }

  const zip = await JSZip.loadAsync(unsignedZipBuffer);
  const manifestFile = zip.file('manifest.json');

  if (!manifestFile) {
    throw new Error('Invalid pass ZIP: manifest.json missing');
  }

  const manifestContent = await manifestFile.async('nodebuffer');

  let signatureBuffer: Buffer | null = null;

  // Sign manifest using OpenSSL if present
  if (fs.existsSync(passPem) && fs.existsSync(passKey) && fs.existsSync(wwdrPem)) {
    const tempManifestPath = path.join(CERTS_DIR, `temp_manifest_${Date.now()}.json`);
    const tempSignaturePath = path.join(CERTS_DIR, `temp_signature_${Date.now()}`);

    try {
      fs.writeFileSync(tempManifestPath, manifestContent);
      
      const cmd = `openssl smime -sign -signer "${passPem}" -inkey "${passKey}" -certfile "${wwdrPem}" -in "${tempManifestPath}" -out "${tempSignaturePath}" -outform DER -binary`;
      execSync(cmd);

      if (fs.existsSync(tempSignaturePath)) {
        signatureBuffer = fs.readFileSync(tempSignaturePath);
      }
    } catch (err) {
      console.error('OpenSSL signing failed:', err);
    } finally {
      if (fs.existsSync(tempManifestPath)) fs.unlinkSync(tempManifestPath);
      if (fs.existsSync(tempSignaturePath)) fs.unlinkSync(tempSignaturePath);
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
    // Return standard spec pass if certificates are not uploaded yet
    const unsignedZipBufferFinal = await zip.generateAsync({ type: 'nodebuffer', mimeType: 'application/vnd.apple.pkpass' });
    return {
      signed: false,
      zipBuffer: unsignedZipBufferFinal,
      message: 'Unsigned pass bundle (Add certificates to ./certs/ for automatic 1-click signing)'
    };
  }
}
