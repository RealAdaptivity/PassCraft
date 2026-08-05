const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const JSZip = require('jszip');

const certsDir = path.join(__dirname, '..', 'certs');
const passPem = path.join(certsDir, 'pass.pem');
const passKey = path.join(certsDir, 'pass.key');
const wwdrPem = path.join(certsDir, 'wwdr.pem');

const opensslBin = fs.existsSync('C:\\Program Files\\Git\\usr\\bin\\openssl.exe')
  ? '"C:\\Program Files\\Git\\usr\\bin\\openssl.exe"'
  : 'openssl';

async function testSignAndVerify() {
  console.log('🔍 Testing Apple PassKit Certificate Chain & PKCS7 Signature...\n');

  // 1. Create a dummy pass manifest
  const dummyManifest = JSON.stringify({
    "pass.json": "8a3294829348",
    "icon.png": "123123123123"
  }, null, 2);

  const tmpDir = __dirname;
  const tempPem = path.join(tmpDir, 'temp_pass.pem');
  const tempKey = path.join(tmpDir, 'temp_pass.key');
  const tempWwdr = path.join(tmpDir, 'temp_wwdr.pem');
  const tempManifest = path.join(tmpDir, 'temp_manifest.json');
  const tempSig = path.join(tmpDir, 'temp_signature');

  try {
    fs.writeFileSync(tempPem, fs.readFileSync(passPem));
    fs.writeFileSync(tempKey, fs.readFileSync(passKey));
    fs.writeFileSync(tempWwdr, fs.readFileSync(wwdrPem));
    fs.writeFileSync(tempManifest, dummyManifest);

    // Run OpenSSL SMIME sign command exactly as Apple specifies
    const signCmd = `${opensslBin} smime -sign -signer "${tempPem}" -inkey "${tempKey}" -certfile "${tempWwdr}" -in "${tempManifest}" -out "${tempSig}" -outform DER -binary`;
    execSync(signCmd);
    console.log('✅ OpenSSL S/MIME Signature generated successfully!');

    // Verify signature against WWDR cert
    const verifyCmd = `${opensslBin} smime -verify -in "${tempSig}" -inform DER -content "${tempManifest}" -CAfile "${tempWwdr}"`;
    const verifyResult = execSync(verifyCmd, { encoding: 'utf-8' });
    console.log('✅ OpenSSL S/MIME Signature Verification Result:\n', verifyResult);

  } catch (err) {
    console.error('❌ Verification Error:\n', err?.stdout || err?.stderr || err?.message);
  } finally {
    [tempPem, tempKey, tempWwdr, tempManifest, tempSig].forEach(f => {
      try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch {}
    });
  }
}

testSignAndVerify();
