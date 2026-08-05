const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certsDir = path.join(__dirname, '..', 'certs');
const opensslBin = fs.existsSync('C:\\Program Files\\Git\\usr\\bin\\openssl.exe')
  ? '"C:\\Program Files\\Git\\usr\\bin\\openssl.exe"'
  : 'openssl';

const passPem = path.join(certsDir, 'pass.pem');
const passKey = path.join(certsDir, 'pass.key');
const fullChainPath = path.join(certsDir, 'wwdr_full_chain.pem');
const manifestPath = path.join(__dirname, 'test_manifest.json');
const sigPath = path.join(__dirname, 'test_signature');

try {
  const verifyCmd = `${opensslBin} smime -verify -in "${sigPath}" -inform DER -content "${manifestPath}" -CAfile "${fullChainPath}" -purpose any`;
  const result = execSync(verifyCmd, { encoding: 'utf-8' });
  console.log('\n🎉 SUCCESS! Certificate chain & PKCS7 signature verified cleanly with Apple Root CA!');
  console.log('Output:', result);
} catch (err) {
  console.error('Verify error:', err?.stdout || err?.stderr || err?.message);
}
