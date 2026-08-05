import React, { useState } from 'react';
import { X, Smartphone, Check, Plus } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ApplePassData } from '../types/pass';

interface ScannerSimulatorProps {
  passData: ApplePassData;
  onClose: () => void;
}

export const ScannerSimulator: React.FC<ScannerSimulatorProps> = ({ passData, onClose }) => {
  const [addedToWallet, setAddedToWallet] = useState<boolean>(false);

  const handleAddToWallet = () => {
    setAddedToWallet(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px', padding: '1.25rem', background: '#090d16' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Smartphone size={16} style={{ color: 'var(--accent-emerald)' }} />
            iOS APPLE WALLET SIMULATOR
          </span>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* iPhone Outer Frame */}
        <div className="iphone-frame">
          <div className="iphone-notch" />
          
          <div className="iphone-screen">
            {/* iOS Status Bar */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#ffffff', fontWeight: 600, padding: '0 0.5rem' }}>
              <span>9:41</span>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* Simulated Apple Wallet Header */}
            <div style={{ width: '100%', textAlign: 'center', margin: '0.5rem 0' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', fontWeight: 700 }}>
                {passData.organizationName || 'APPLE WALLET'}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
                {passData.title || 'Digital Pass'}
              </div>
            </div>

            {/* Wallet Pass Card Mini Snapshot */}
            <div 
              style={{
                width: '100%',
                borderRadius: '16px',
                backgroundColor: passData.backgroundColor || '#0f172a',
                color: passData.foregroundColor || '#ffffff',
                padding: '1rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  {passData.logoText || 'PASSCRAFT'}
                </span>
                {passData.headerFields[0] && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.55rem', color: passData.labelColor }}>{passData.headerFields[0].label}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{passData.headerFields[0].value}</div>
                  </div>
                )}
              </div>

              {passData.primaryFields[0] && (
                <div>
                  <div style={{ fontSize: '0.6rem', color: passData.labelColor }}>{passData.primaryFields[0].label}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{passData.primaryFields[0].value}</div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                {passData.secondaryFields[0] && (
                  <div>
                    <div style={{ fontSize: '0.55rem', color: passData.labelColor }}>{passData.secondaryFields[0].label}</div>
                    <div style={{ fontWeight: 600 }}>{passData.secondaryFields[0].value}</div>
                  </div>
                )}
                {passData.auxiliaryFields[0] && (
                  <div>
                    <div style={{ fontSize: '0.55rem', color: passData.labelColor }}>{passData.auxiliaryFields[0].label}</div>
                    <div style={{ fontWeight: 600 }}>{passData.auxiliaryFields[0].value}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Add to Apple Wallet Notification / Button */}
            <div style={{ marginTop: 'auto', width: '100%', paddingBottom: '1rem' }}>
              {addedToWallet ? (
                <div style={{ 
                  background: 'rgba(16, 185, 129, 0.2)', 
                  border: '1px solid rgba(16, 185, 129, 0.4)', 
                  borderRadius: '14px', 
                  padding: '0.85rem', 
                  textAlign: 'center',
                  color: 'var(--accent-emerald)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  <Check size={18} />
                  Pass Added to Apple Wallet!
                </div>
              ) : (
                <button 
                  onClick={handleAddToWallet}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '14px',
                    background: '#ffffff',
                    color: '#000000',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 15px rgba(255,255,255,0.2)'
                  }}
                >
                  <Plus size={16} />
                  <span>Add to Apple Wallet</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
