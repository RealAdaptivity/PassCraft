import React, { useEffect, useState } from 'react';
import { ApplePassData } from '../types/pass';
import { generateQrCodeDataUrl } from '../utils/imageExporter';
import { RotateCw, Sparkles, Smartphone, Info } from 'lucide-react';

interface PassPreviewProps {
  passData: ApplePassData;
  isFlipped: boolean;
  onToggleFlip: () => void;
  onOpenSimulator: () => void;
}

export const PassPreview: React.FC<PassPreviewProps> = ({
  passData,
  isFlipped,
  onToggleFlip,
  onOpenSimulator
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    generateQrCodeDataUrl(passData.barcode.message, {
      color: { dark: '#000000', light: '#ffffff' },
      width: 250
    }).then(url => {
      if (isMounted) setQrCodeDataUrl(url);
    });
    return () => {
      isMounted = false;
    };
  }, [passData.barcode.message, passData.barcode.format]);

  return (
    <div className="preview-pane">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '340px' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={14} style={{ color: 'var(--accent-blue)' }} />
          LIVE PASS PREVIEW
        </span>
        <button 
          className="btn btn-secondary btn-icon" 
          onClick={onToggleFlip}
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
          title="Click to flip card"
        >
          <RotateCw size={14} />
          <span>{isFlipped ? 'Show Front' : 'Flip to Back'}</span>
        </button>
      </div>

      <div className="card-perspective-wrapper">
        <div 
          id="apple-wallet-card-render"
          className={`apple-wallet-pass-card ${isFlipped ? 'flipped' : ''}`}
          onClick={onToggleFlip}
          style={{
            backgroundColor: passData.backgroundColor || '#0f172a',
            color: passData.foregroundColor || '#ffffff'
          }}
        >
          {/* ================= FRONT SIDE ================= */}
          <div className="pass-card-side pass-card-front">
            {/* Pass Header */}
            <div className="pass-header">
              <div className="pass-logo-area">
                <div style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '6px', 
                  background: passData.foregroundColor || '#ffffff', 
                  color: passData.backgroundColor || '#000000',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}>
                  {passData.logoText ? passData.logoText.charAt(0) : 'P'}
                </div>
                <span className="pass-logo-text" style={{ color: passData.foregroundColor }}>
                  {passData.logoText || passData.organizationName || 'PASSCRAFT'}
                </span>
              </div>

              {passData.headerFields.length > 0 && (
                <div className="pass-header-fields">
                  {passData.headerFields.map((field) => (
                    <div key={field.id}>
                      <div className="field-label" style={{ color: passData.labelColor || '#94a3b8' }}>
                        {field.label}
                      </div>
                      <div className="field-value" style={{ color: passData.foregroundColor || '#ffffff' }}>
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Optional Strip Banner */}
            {passData.stripImage && (
              <div 
                className="pass-strip-container" 
                style={{ backgroundImage: `url(${passData.stripImage})` }} 
              />
            )}

            {/* Primary Field */}
            {passData.primaryFields.length > 0 && (
              <div className="pass-primary-section">
                {passData.primaryFields.map((field) => (
                  <div key={field.id} className="primary-field">
                    <div className="field-label" style={{ color: passData.labelColor || '#94a3b8' }}>
                      {field.label}
                    </div>
                    <div className="field-value" style={{ color: passData.foregroundColor || '#ffffff' }}>
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Secondary Fields */}
            {passData.secondaryFields.length > 0 && (
              <div className="pass-secondary-grid">
                {passData.secondaryFields.map((field) => (
                  <div key={field.id}>
                    <div className="field-label" style={{ color: passData.labelColor || '#94a3b8' }}>
                      {field.label}
                    </div>
                    <div className="field-value" style={{ color: passData.foregroundColor || '#ffffff' }}>
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Auxiliary Fields */}
            {passData.auxiliaryFields.length > 0 && (
              <div className="pass-auxiliary-grid">
                {passData.auxiliaryFields.map((field) => (
                  <div key={field.id}>
                    <div className="field-label" style={{ color: passData.labelColor || '#94a3b8' }}>
                      {field.label}
                    </div>
                    <div className="field-value" style={{ color: passData.foregroundColor || '#ffffff' }}>
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Barcode / QR Code Block */}
            <div className="pass-barcode-wrapper">
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="Pass QR Code" 
                  className="barcode-image" 
                />
              ) : (
                <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                  Generating QR Code...
                </div>
              )}
              {passData.barcode.altText && (
                <div className="barcode-alt-text">
                  {passData.barcode.altText}
                </div>
              )}
            </div>
          </div>

          {/* ================= BACK SIDE ================= */}
          <div className="pass-card-side pass-card-back">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.5rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Info size={16} />
                Pass Details & Info
              </div>
              <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>Apple Wallet Card</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', overflowY: 'auto', flex: 1, paddingRight: '0.25rem' }}>
              {passData.backFields.map((field) => (
                <div key={field.id}>
                  <div className="field-label" style={{ color: passData.labelColor || '#94a3b8' }}>
                    {field.label}
                  </div>
                  <div className="field-value" style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                    {field.value}
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.65rem', opacity: 0.6 }}>
                <div>Serial: {passData.serialNumber}</div>
                <div>Pass ID: {passData.passTypeIdentifier}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Trigger Bar */}
      <div className="pass-actions-bar">
        <button 
          className="btn btn-secondary" 
          onClick={onOpenSimulator}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Smartphone size={16} style={{ color: 'var(--accent-emerald)' }} />
          <span>Simulate iPhone Wallet View</span>
        </button>
      </div>
    </div>
  );
};
