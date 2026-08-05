const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const forge = require('node-forge');

const certsDir = path.join(__dirname, '..', 'certs');
const passPem = fs.readFileSync(path.join(certsDir, 'pass.pem'), 'utf-8');
const passKey = fs.readFileSync(path.join(certsDir, 'pass.key'), 'utf-8');
const fullChainPem = fs.readFileSync(path.join(certsDir, 'wwdr_full_chain.pem'), 'utf-8');

const manifestContent = Buffer.from('{"test": true}');

function createPkcs7SignatureNodeForge(manifestBuffer, signerPem, keyPem, chainPem) {
  const p7 = forge.pkcs7.createSignedData();
  p7.content = forge.util.createBuffer(manifestBuffer.toString('binary'), 'raw');

  const signerCert = forge.pki.certificateFromPem(signerPem);
  const signerKey = forge.pki.privateKeyFromPem(keyPem);

  p7.addCertificate(signerCert);

  // Add all certificates from chain (WWDR + Apple Root CA)
  const certBlocks = chainPem.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g) || [chainPem];
  certBlocks.forEach(c => {
    try {
      const cert = forge.pki.certificateFromPem(c);
      p7.addCertificate(cert);
    } catch (e) {}
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

console.log('Testing node-forge PKCS7 signature with full CA chain...');
const sigBuffer = createPkcs7SignatureNodeForge(manifestContent, passPem, passKey, fullChainPem);
console.log('Signature generated size:', sigBuffer.length, 'bytes');

// Write signature & test manifest to file and verify with OpenSSL
const manifestPath = path.join(__dirname, 'forge_manifest.json');
const sigPath = path.join(__dirname, 'forge_signature');
fs.writeFileSync(manifestPath, manifestContent);
fs.writeFileSync(sigPath, sigBuffer);

const opensslBin = fs.existsSync('C:\\Program Files\\Git\\usr\\bin\\openssl.exe')
  ? '"C:\\Program Files\\Git\\usr\\bin\\openssl.exe"'
  : 'openssl';

try {
  const verifyCmd = `${opensslBin} smime -verify -in "${sigPath}" -inform DER -content "${manifestPath}" -CAfile "${path.join(certsDir, 'wwdr_full_chain.pem')}" -purpose any`;
  const result = execSync(verifyCmd, { encoding: 'utf-8' });
  console.log('\n🎉 NODE-FORGE SIGNATURE VERIFIED SUCCESSFULLY BY OPENSSL!');
  console.log(result);
} catch (err) {
  console.error('Verify error:', err?.stdout || err?.stderr || err?.message);
}
