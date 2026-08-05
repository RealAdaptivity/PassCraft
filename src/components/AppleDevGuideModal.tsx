import React from 'react';
import { X, ShieldCheck, Key, FileCode, CheckCircle2 } from 'lucide-react';
import { ApplePassData } from '../types/pass';

interface AppleDevGuideModalProps {
  passData: ApplePassData;
  onUpdatePass: (updated: Partial<ApplePassData>) => void;
  onClose: () => void;
}

export const AppleDevGuideModal: React.FC<AppleDevGuideModalProps> = ({
  passData,
  onUpdatePass,
  onClose
}) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '680px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ 
              padding: '0.4rem', 
              borderRadius: '8px', 
              background: 'rgba(245, 158, 11, 0.15)', 
              color: 'var(--accent-amber)' 
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700 }}>
                Apple Developer Account Integration
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Configure your official Pass Type Identifier & Team ID for iOS signing
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Form input section for Pass Type ID and Team ID */}
          <div style={{ 
            background: 'var(--bg-primary)', 
            padding: '1.25rem', 
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)' 
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={16} style={{ color: 'var(--accent-amber)' }} />
              Developer Credentials Settings
            </h4>

            <div className="form-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Pass Type Identifier</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="pass.com.passcraft.eventpass"
                  value={passData.passTypeIdentifier}
                  onChange={e => onUpdatePass({ passTypeIdentifier: e.target.value })}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Registered in Apple Developer Portal under Identifiers
                </span>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Apple Team ID</label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="68QFVQ738K"
                  value={passData.teamIdentifier}
                  onChange={e => onUpdatePass({ teamIdentifier: e.target.value })}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Found at top right of developer.apple.com
                </span>
              </div>
            </div>
          </div>

          {/* 3 Step setup guide */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCode size={16} style={{ color: 'var(--accent-blue)' }} />
              How to Sign your Pass for Native iOS Apple Wallet
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: 'var(--accent-blue)', 
                  color: '#000', 
                  fontWeight: 700, 
                  fontSize: '0.8rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0 
                }}>1</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Register Pass Type ID & Download Certificate</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Go to <code>developer.apple.com &gt; Certificates, Identifiers & Profiles &gt; Pass Type IDs</code>. Create a Pass Type ID and generate a Pass Type Certificate (<code>pass.cer</code>).
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: 'var(--accent-blue)', 
                  color: '#000', 
                  fontWeight: 700, 
                  fontSize: '0.8rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0 
                }}>2</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Export `.pkpass` Package from PassCraft</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Click <b>Export Pass &gt; Download .pkpass Zip Package</b>. It contains your spec-compliant <code>pass.json</code>, manifest, icons, and barcode image.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: 'var(--accent-blue)', 
                  color: '#000', 
                  fontWeight: 700, 
                  fontSize: '0.8rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0 
                }}>3</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Sign Manifest with OpenSSL / signpass</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Run this standard sign command to attach your Apple signature:
                  </div>
                  <div style={{ 
                    background: '#090d16', 
                    padding: '0.6rem 0.85rem', 
                    borderRadius: '8px', 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '0.75rem', 
                    color: 'var(--accent-emerald)', 
                    border: '1px solid var(--border-subtle)',
                    overflowX: 'auto'
                  }}>
                    openssl smime -sign -signer pass.pem -inkey pass.key -in manifest.json -out signature -outform DER -binary
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button className="btn btn-primary" onClick={onClose}>
              <CheckCircle2 size={16} />
              <span>Apply Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
