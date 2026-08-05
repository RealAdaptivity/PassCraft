import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import JSZip from 'jszip';
const CERTS_DIR = path.join(process.cwd(), 'certs');
// Read cert from env var (base64) or file
function getCertContent(envVar, filePath) {
    // Try environment variable first (Railway deployment)
    const envVal = process.env[envVar];
    if (envVal) {
        return Buffer.from(envVal, 'base64').toString('utf-8');
    }
    // Fall back to file (local dev)
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf-8');
    }
    return null;
}
export function isCertificatesAvailable() {
    // Check env vars (Railway)
    if (process.env.PASS_PEM && process.env.PASS_KEY && process.env.WWDR_PEM) {
        return true;
    }
    // Check local files
    const passPem = path.join(CERTS_DIR, 'pass.pem');
    const passKey = path.join(CERTS_DIR, 'pass.key');
    const wwdrPem = path.join(CERTS_DIR, 'wwdr.pem');
    const passCer = path.join(CERTS_DIR, 'pass.cer');
    return (fs.existsSync(passPem) || fs.existsSync(passCer)) &&
        fs.existsSync(passKey) &&
        fs.existsSync(wwdrPem);
}
export async function signAndPackagePass(unsignedZipBuffer) {
    if (!fs.existsSync(CERTS_DIR)) {
        fs.mkdirSync(CERTS_DIR, { recursive: true });
    }
    const opensslBin = fs.existsSync('C:\\Program Files\\Git\\usr\\bin\\openssl.exe')
        ? '"C:\\Program Files\\Git\\usr\\bin\\openssl.exe"'
        : 'openssl';
    // Get cert contents (from env vars or files)
    let passPemContent = getCertContent('PASS_PEM', path.join(CERTS_DIR, 'pass.pem'));
    const passKeyContent = getCertContent('PASS_KEY', path.join(CERTS_DIR, 'pass.key'));
    const wwdrPemContent = getCertContent('WWDR_PEM', path.join(CERTS_DIR, 'wwdr.pem'));
    // Auto-convert pass.cer -> pass.pem if needed (local only)
    if (!passPemContent) {
        const passCer = path.join(CERTS_DIR, 'pass.cer');
        const passPem = path.join(CERTS_DIR, 'pass.pem');
        if (fs.existsSync(passCer)) {
            try {
                execSync(`${opensslBin} x509 -in "${passCer}" -inform DER -out "${passPem}"`);
                passPemContent = fs.readFileSync(passPem, 'utf-8');
                console.log('Converted pass.cer -> pass.pem');
            }
            catch (err) {
                console.warn('Failed to convert pass.cer:', err);
            }
        }
    }
    const zip = await JSZip.loadAsync(unsignedZipBuffer);
    const manifestFile = zip.file('manifest.json');
    if (!manifestFile) {
        throw new Error('Invalid pass ZIP: manifest.json missing');
    }
    const manifestContent = await manifestFile.async('nodebuffer');
    let signatureBuffer = null;
    // Sign if we have all three certs
    if (passPemContent && passKeyContent && wwdrPemContent) {
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
            }
        }
        catch (err) {
            console.error('OpenSSL signing failed:', err);
        }
        finally {
            [tempPem, tempKey, tempWwdr, tempManifest, tempSig].forEach(f => {
                try {
                    if (fs.existsSync(f))
                        fs.unlinkSync(f);
                }
                catch { }
            });
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
    }
    else {
        const unsignedFinal = await zip.generateAsync({ type: 'nodebuffer', mimeType: 'application/vnd.apple.pkpass' });
        return {
            signed: false,
            zipBuffer: unsignedFinal,
            message: 'Unsigned pass bundle (add PASS_PEM, PASS_KEY, WWDR_PEM env vars to enable signing)'
        };
    }
}
