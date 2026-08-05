import React, { useState } from 'react';
import { X, Download, FileArchive, Image as ImageIcon, QrCode, Share2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ApplePassData } from '../types/pass';
import { generatePKPassZip } from '../utils/pkpassGenerator';
import { downloadPassAsPng, generateQrCodeDataUrl, downloadDataUrl } from '../utils/imageExporter';

interface ExportModalProps {
  passData: ApplePassData;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ passData, onClose }) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const fireConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleDownloadPKPass = async () => {
    try {
      setIsExporting(true);
      const zipBlob = await generatePKPassZip(passData);
      const filename = `${passData.title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'pass'}.pkpass`;
      
      let finalBlob = zipBlob;

      // Try server signing endpoint
      try {
        const response = await fetch('http://localhost:3001/api/sign-pass', {
          method: 'POST',
          headers: { 'Content-Type': 'application/zip' },
          body: zipBlob
        });

        if (response.ok) {
          finalBlob = await response.blob();
          const isSigned = response.headers.get('X-Pass-Signed') === 'true';
          if (isSigned) {
            console.log('Pass signed by PassCraft server!');
          }
        }
      } catch (e) {
        console.log('Server signer offline, providing client-side bundle.', e);
      }
      
      const url = URL.createObjectURL(finalBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      
      fireConfetti();
    } catch (err) {
      console.error('Failed to export PKPass:', err);
      alert('Error generating .pkpass file. Please check field inputs.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadPNG = async () => {
    try {
      setIsExporting(true);
      const filename = `${passData.title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'pass'}-card.png`;
      await downloadPassAsPng('apple-wallet-card-render', filename);
      fireConfetti();
    } catch (err) {
      console.error('Failed to export image:', err);
      alert('Failed to generate pass PNG image.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadQRCode = async () => {
    try {
      setIsExporting(true);
      const qrDataUrl = await generateQrCodeDataUrl(passData.barcode.message, { width: 600 });
      if (qrDataUrl) {
        const filename = `${passData.title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'pass'}-qrcode.png`;
        downloadDataUrl(qrDataUrl, filename);
        fireConfetti();
      }
    } catch (err) {
      console.error('Failed to export QR code:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyShareLink = () => {
    const jsonStr = JSON.stringify(passData);
    const encoded = btoa(encodeURIComponent(jsonStr));
    const shareableUrl = `${window.location.origin}${window.location.pathname}?pass=${encoded}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
    fireConfetti();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '580px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', color: 'var(--accent-purple)' }}>
              <Download size={22} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700 }}>
                Export & Download Pass
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Choose your preferred export format for web, mobile, or Apple Wallet
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Option 1: .pkpass ZIP Bundle */}
          <div style={{ 
            background: 'var(--bg-primary)', 
            padding: '1.1rem', 
            borderRadius: '14px', 
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
              <div style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '10px', 
                background: 'rgba(56, 189, 248, 0.15)', 
                color: 'var(--accent-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileArchive size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Apple Wallet (.pkpass) Bundle</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Complete ZIP archive containing <code>pass.json</code>, manifest, icons & barcode
                </div>
              </div>
            </div>
            <button 
              className="btn btn-primary" 
              onClick={handleDownloadPKPass} 
              disabled={isExporting}
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}
            >
              <Download size={14} />
              <span>Download .pkpass</span>
            </button>
          </div>

          {/* Option 2: HD PNG Pass Card Image */}
          <div style={{ 
            background: 'var(--bg-primary)', 
            padding: '1.1rem', 
            borderRadius: '14px', 
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
              <div style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '10px', 
                background: 'rgba(16, 185, 129, 0.15)', 
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ImageIcon size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>HD Pass Card Image (PNG)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  High-res snapshot of your front pass card design
                </div>
              </div>
            </div>
            <button 
              className="btn btn-secondary" 
              onClick={handleDownloadPNG}
              disabled={isExporting}
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}
            >
              <Download size={14} />
              <span>Download PNG</span>
            </button>
          </div>

          {/* Option 3: Standalone Vector QR Code */}
          <div style={{ 
            background: 'var(--bg-primary)', 
            padding: '1.1rem', 
            borderRadius: '14px', 
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
              <div style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '10px', 
                background: 'rgba(245, 158, 11, 0.15)', 
                color: 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <QrCode size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Standalone QR Code PNG</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  High-resolution 600x600 QR code image file
                </div>
              </div>
            </div>
            <button 
              className="btn btn-secondary" 
              onClick={handleDownloadQRCode}
              disabled={isExporting}
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}
            >
              <Download size={14} />
              <span>Download QR</span>
            </button>
          </div>

          {/* Option 4: Shareable Pass Web Link */}
          <div style={{ 
            background: 'var(--bg-primary)', 
            padding: '1.1rem', 
            borderRadius: '14px', 
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
              <div style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '10px', 
                background: 'rgba(168, 85, 247, 0.15)', 
                color: 'var(--accent-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Share2 size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Shareable Web Pass Link</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Generate encoded link to view pass on mobile browsers
                </div>
              </div>
            </div>
            <button 
              className={`btn ${copiedLink ? 'btn-primary' : 'btn-secondary'}`}
              onClick={handleCopyShareLink}
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem' }}
            >
              {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
