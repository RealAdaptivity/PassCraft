const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const certsDir = path.join(__dirname, '..', 'certs');
const opensslBin = fs.existsSync('C:\\Program Files\\Git\\usr\\bin\\openssl.exe')
  ? '"C:\\Program Files\\Git\\usr\\bin\\openssl.exe"'
  : 'openssl';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function fixCertChain() {
  console.log('📥 Fetching official Apple Root CA Certificate from Apple PKI...');
  const rootCerPath = path.join(certsDir, 'AppleRootCA.cer');
  const rootPemPath = path.join(certsDir, 'AppleRootCA.pem');

  try {
    await downloadFile('https://www.apple.com/appleca/AppleIncRootCertificate.cer', rootCerPath);
    console.log('✅ Downloaded Apple Root CA');

    // Convert DER to PEM
    execSync(`${opensslBin} x509 -in "${rootCerPath}" -inform DER -out "${rootPemPath}"`);
    console.log('✅ Converted Apple Root CA to PEM format');

    // Combine WWDR G4 + Apple Root CA into a complete CA chain bundle
    const wwdrPemContent = fs.readFileSync(path.join(certsDir, 'wwdr.pem'), 'utf-8');
    const rootPemContent = fs.readFileSync(rootPemPath, 'utf-8');
    const fullChainPem = wwdrPemContent + '\n' + rootPemContent;

    const fullChainPath = path.join(certsDir, 'wwdr_full_chain.pem');
    fs.writeFileSync(fullChainPath, fullChainPem);
    console.log('✅ Combined WWDR G4 + Apple Root CA into complete chain!');

    // Test OpenSSL verification with complete chain
    const passPem = path.join(certsDir, 'pass.pem');
    const passKey = path.join(certsDir, 'pass.key');
    const manifestPath = path.join(__dirname, 'test_manifest.json');
    const sigPath = path.join(__dirname, 'test_signature');
    fs.writeFileSync(manifestPath, '{"test": true}');

    const signCmd = `${opensslBin} smime -sign -signer "${passPem}" -inkey "${passKey}" -certfile "${fullChainPath}" -in "${manifestPath}" -out "${sigPath}" -outform DER -binary`;
    execSync(signCmd);

    const verifyCmd = `${opensslBin} smime -verify -in "${sigPath}" -inform DER -content "${manifestPath}" -CAfile "${fullChainPath}"`;
    const result = execSync(verifyCmd, { encoding: 'utf-8' });
    console.log('\n🎉 CERTIFICATE VERIFICATION SUCCESSFUL!');
    console.log(result);

  } catch (err) {
    console.error('❌ Error during cert chain test:', err?.stdout || err?.stderr || err?.message);
  }
}

fixCertChain();
