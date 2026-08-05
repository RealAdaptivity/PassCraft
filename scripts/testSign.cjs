const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const certsDir = path.join(__dirname, '..', 'certs');
const passPem = path.join(certsDir, 'pass.pem');
const wwdrPem = path.join(certsDir, 'wwdr.pem');

const opensslBin = fs.existsSync('C:\\Program Files\\Git\\usr\\bin\\openssl.exe')
  ? '"C:\\Program Files\\Git\\usr\\bin\\openssl.exe"'
  : 'openssl';

console.log('--- PASS CERTIFICATE ---');
console.log(execSync(`${opensslBin} x509 -in "${passPem}" -noout -subject -issuer`, { encoding: 'utf-8' }));

console.log('--- WWDR CERTIFICATE ---');
console.log(execSync(`${opensslBin} x509 -in "${wwdrPem}" -noout -subject -issuer`, { encoding: 'utf-8' }));
