import { toPng, toSvg } from 'html-to-image';
import QRCode from 'qrcode';

export async function downloadPassAsPng(elementId: string, filename: string = 'apple-wallet-pass.png'): Promise<void> {
  const node = document.getElementById(elementId);
  if (!node) {
    throw new Error(`Element with id #${elementId} not found`);
  }

  const dataUrl = await toPng(node, {
    quality: 0.95,
    pixelRatio: 3, // High-DPI resolution
    cacheBust: true,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export async function downloadPassAsSvg(elementId: string, filename: string = 'apple-wallet-pass.svg'): Promise<void> {
  const node = document.getElementById(elementId);
  if (!node) {
    throw new Error(`Element with id #${elementId} not found`);
  }

  const dataUrl = await toSvg(node, {
    pixelRatio: 2,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export async function generateQrCodeDataUrl(
  text: string, 
  options?: { 
    color?: { dark?: string; light?: string }; 
    width?: number;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  }
): Promise<string> {
  try {
    return await QRCode.toDataURL(text || 'https://passcraft.app', {
      width: options?.width || 300,
      margin: 1,
      color: {
        dark: options?.color?.dark || '#000000',
        light: options?.color?.light || '#ffffff'
      },
      errorCorrectionLevel: options?.errorCorrectionLevel || 'M'
    });
  } catch (err) {
    console.error('Error generating QR code:', err);
    return '';
  }
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
