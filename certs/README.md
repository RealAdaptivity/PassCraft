# Apple Developer Certificates Directory

To enable **1-Click Automatic PKPass Signing**, place your Apple certificates into this `./certs` folder:

### Accepted Certificate Formats:

#### Option 1: PKCS#12 File (Simplest)
Drop your exported `.p12` certificate file here:
- `certs/pass.p12`

#### Option 2: PEM Files (Standard OpenSSL)
- `certs/pass.pem` (Your Pass Type Certificate for `pass.com.passcraft.eventpass`)
- `certs/pass.key` (Your Certificate Private Key)
- `certs/wwdr.pem` (Apple Worldwide Developer Relations Intermediate Certificate)

---
Once placed here, the PassCraft signing server will automatically sign every exported `.pkpass` file with your official Apple Developer signature!
