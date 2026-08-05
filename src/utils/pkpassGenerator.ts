import JSZip from 'jszip';
import { ApplePassData } from '../types/pass';

// Helper to convert canvas to Blob/Uint8Array
function canvasToUint8Array(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(new Uint8Array(0));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        resolve(new Uint8Array(arrayBuffer));
      };
      reader.readAsArrayBuffer(blob);
    }, 'image/png');
  });
}

// Generate a clean solid colored or text icon PNG for pass package
async function createPassImage(text: string, width: number, height: number, bgColor: string, fgColor: string): Promise<Uint8Array> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new Uint8Array(0);

  // Background
  ctx.fillStyle = bgColor || '#0f172a';
  ctx.fillRect(0, 0, width, height);

  // Border accent
  ctx.strokeStyle = fgColor || '#ffffff';
  ctx.lineWidth = Math.max(2, Math.floor(width / 30));
  ctx.strokeRect(4, 4, width - 8, height - 8);

  // Text / Initials
  ctx.fillStyle = fgColor || '#ffffff';
  ctx.font = `bold ${Math.floor(height * 0.4)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const label = text.substring(0, 3).toUpperCase() || 'PAS';
  ctx.fillText(label, width / 2, height / 2);

  return canvasToUint8Array(canvas);
}

// Simple SHA-1 hash implementation for browser manifest calculation
async function sha1Hex(data: string | Uint8Array): Promise<string> {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const hashBuffer = await crypto.subtle.digest('SHA-1', bytes.buffer as ArrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generatePKPassZip(passData: ApplePassData): Promise<Blob> {
  const zip = new JSZip();

  // Convert fields to Apple PassKit schema format
  const mapField = (f: { key: string; label: string; value: string }) => ({
    key: f.key || f.label.toLowerCase().replace(/\s+/g, '_'),
    label: f.label,
    value: f.value
  });

  // Construct pass.json per Apple PassKit specification
  const passJsonStructure: Record<string, unknown> = {
    formatVersion: 1,
    passTypeIdentifier: passData.passTypeIdentifier || 'pass.com.passcraft.eventpass',
    serialNumber: passData.serialNumber || `PASS-${Date.now()}`,
    teamIdentifier: passData.teamIdentifier || '68QFVQ738K',
    organizationName: passData.organizationName || 'PassCraft Studio',
    description: passData.description || passData.title || 'Digital Apple Wallet Pass',
    logoText: passData.logoText || 'PASSCRAFT',
    
    backgroundColor: passData.backgroundColor || '#0f172a',
    foregroundColor: passData.foregroundColor || '#ffffff',
    labelColor: passData.labelColor || '#94a3b8',

    barcodes: [
      {
        message: passData.barcode.message,
        format: passData.barcode.format,
        messageEncoding: passData.barcode.messageEncoding || 'iso-8859-1',
        altText: passData.barcode.altText || ''
      }
    ],
    // Legacy single barcode fallback for older iOS
    barcode: {
      message: passData.barcode.message,
      format: passData.barcode.format,
      messageEncoding: passData.barcode.messageEncoding || 'iso-8859-1',
      altText: passData.barcode.altText || ''
    }
  };

  // Attach pass structure dictionary for pass type
  const passStructureKey = passData.passType || 'generic';
  const typeDict: Record<string, unknown> = {
    headerFields: passData.headerFields.map(mapField),
    primaryFields: passData.primaryFields.map(mapField),
    secondaryFields: passData.secondaryFields.map(mapField),
    auxiliaryFields: passData.auxiliaryFields.map(mapField),
    backFields: passData.backFields.map(mapField)
  };

  if (passStructureKey === 'boardingPass' && passData.transitType) {
    typeDict.transitType = passData.transitType;
  }

  passJsonStructure[passStructureKey] = typeDict;

  const passJsonString = JSON.stringify(passJsonStructure, null, 2);

  // Generate icons and logos
  const iconPng = await createPassImage(passData.logoText || 'PASS', 29, 29, passData.backgroundColor, passData.foregroundColor);
  const icon2xPng = await createPassImage(passData.logoText || 'PASS', 58, 58, passData.backgroundColor, passData.foregroundColor);
  const logoPng = await createPassImage(passData.logoText || 'PASS', 160, 50, passData.backgroundColor, passData.foregroundColor);
  const logo2xPng = await createPassImage(passData.logoText || 'PASS', 320, 100, passData.backgroundColor, passData.foregroundColor);

  // Files map for manifest checksum
  const files: Record<string, Uint8Array | string> = {
    'pass.json': passJsonString,
    'icon.png': iconPng,
    'icon@2x.png': icon2xPng,
    'logo.png': logoPng,
    'logo@2x.png': logo2xPng
  };

  // Add files to Zip and calculate manifest.json
  const manifest: Record<string, string> = {};

  for (const [filename, content] of Object.entries(files)) {
    if (typeof content === 'string') {
      zip.file(filename, content);
      manifest[filename] = await sha1Hex(content);
    } else {
      zip.file(filename, content);
      manifest[filename] = await sha1Hex(content);
    }
  }

  // Add manifest.json
  const manifestJsonString = JSON.stringify(manifest, null, 2);
  zip.file('manifest.json', manifestJsonString);

  // Generate final ZIP blob
  return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.apple.pkpass' });
}
