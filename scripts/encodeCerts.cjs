/**
 * Run this script ONCE to encode your Apple certificates as base64 strings.
 * Then paste the output values as Environment Variables in Railway.
 * 
 * Usage:
 *   node scripts/encodeCerts.cjs
 */
const fs = require('fs');
const path = require('path');

const certsDir = path.join(__dirname, '..', 'certs');

function encodeFile(filename) {
  const filePath = path.join(certsDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  ${filename} not found in certs/ - skipping`);
    return null;
  }
  const content = fs.readFileSync(filePath);
  return content.toString('base64');
}

console.log('\n🔐 PassCraft Certificate Encoder for Railway\n');
console.log('Copy these values as Railway Environment Variables:\n');
console.log('─'.repeat(60));

const passPem = encodeFile('pass.pem');
const passKey = encodeFile('pass.key');
const wwdrPem = encodeFile('wwdr.pem');

if (passPem) {
  console.log(`\nPASS_PEM=\n${passPem}\n`);
}
if (passKey) {
  console.log(`PASS_KEY=\n${passKey}\n`);
}
if (wwdrPem) {
  console.log(`WWDR_PEM=\n${wwdrPem}\n`);
}

console.log('─'.repeat(60));
console.log('\n✅ Go to Railway > Your Service > Variables and add each one above.\n');
