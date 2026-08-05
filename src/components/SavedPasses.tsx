import React from 'react';
import { X, Bookmark, Trash2, Copy, Play, Plus, Clock } from 'lucide-react';
import { ApplePassData } from '../types/pass';

interface SavedPassesProps {
  savedPasses: ApplePassData[];
  onLoadPass: (pass: ApplePassData) => void;
  onDuplicatePass: (pass: ApplePassData) => void;
  onDeletePass: (id: string) => void;
  onSaveCurrentPass: () => void;
  onClose: () => void;
}

export const SavedPasses: React.FC<SavedPassesProps> = ({
  savedPasses,
  onLoadPass,
  onDuplicatePass,
  onDeletePass,
  onSaveCurrentPass,
  onClose
}) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-blue)' }}>
              <Bookmark size={22} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700 }}>
                My Saved Passes Library
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Manage, edit, or duplicate your saved Apple Wallet designs
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={onSaveCurrentPass}>
            <Plus size={16} />
            <span>Save Current Active Pass Design</span>
          </button>
        </div>

        {savedPasses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-primary)', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <Bookmark size={32} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>No saved passes yet</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Click "Save Current Active Pass Design" above to store your creations locally in your browser.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
            {savedPasses.map((pass) => (
              <div 
                key={pass.id}
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div 
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: pass.backgroundColor || '#0f172a',
                      border: '1px solid rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: pass.foregroundColor || '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.9rem'
                    }}
                  >
                    {pass.title ? pass.title.charAt(0) : 'P'}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{pass.title || 'Untitled Pass'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{pass.organizationName}</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Clock size={11} />
                        {new Date(pass.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button 
                    className="btn btn-secondary btn-icon" 
                    onClick={() => {
                      onLoadPass(pass);
                      onClose();
                    }}
                    title="Load into Editor"
                  >
                    <Play size={14} style={{ color: 'var(--accent-emerald)' }} />
                  </button>

                  <button 
                    className="btn btn-secondary btn-icon" 
                    onClick={() => onDuplicatePass(pass)}
                    title="Duplicate Pass"
                  >
                    <Copy size={14} style={{ color: 'var(--accent-blue)' }} />
                  </button>

                  <button 
                    className="btn btn-secondary btn-icon" 
                    onClick={() => onDeletePass(pass.id)}
                    title="Delete Pass"
                  >
                    <Trash2 size={14} style={{ color: 'var(--accent-rose)' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
