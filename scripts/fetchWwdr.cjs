const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certsDir = path.join(__dirname, '..', 'certs');
const wwdrCerPath = path.join(certsDir, 'wwdr.cer');
const wwdrPemPath = path.join(certsDir, 'wwdr.pem');

const opensslBin = fs.existsSync('C:\\Program Files\\Git\\usr\\bin\\openssl.exe') 
  ? '"C:\\Program Files\\Git\\usr\\bin\\openssl.exe"' 
  : 'openssl';

const file = fs.createWriteStream(wwdrCerPath);
https.get('https://www.apple.com/certificateauthority/AppleWWDRCAG4.cer', (res) => {
  res.pipe(file);
  file.on('finish', () => {
    file.close(() => {
      try {
        execSync(`${opensslBin} x509 -in "${wwdrCerPath}" -inform DER -out "${wwdrPemPath}"`);
        console.log('Downloaded and converted Apple WWDR G4 certificate successfully!');
      } catch (err) {
        console.error('Failed to convert wwdr.cer:', err);
      }
    });
  });
});
