import React from 'react';
import { QrCode, Sparkles, Download, Bookmark, Key, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onOpenTemplates: () => void;
  onOpenExport: () => void;
  onOpenSaved: () => void;
  onOpenAppleDevModal: () => void;
  onResetPass: () => void;
  savedPassesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTemplates,
  onOpenExport,
  onOpenSaved,
  onOpenAppleDevModal,
  onResetPass,
  savedPassesCount
}) => {
  return (
    <header className="app-header">
      <div className="brand-logo">
        <div className="brand-icon">
          <QrCode size={22} />
        </div>
        <span>PassCraft</span>
        <span className="brand-badge">Apple Wallet Studio</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button 
          className="btn btn-secondary"
          onClick={onOpenTemplates}
          title="Browse pass templates"
        >
          <Sparkles size={16} />
          <span>Templates</span>
        </button>

        <button 
          className="btn btn-secondary"
          onClick={onOpenSaved}
          title="View saved pass designs"
        >
          <Bookmark size={16} />
          <span>My Passes</span>
          {savedPassesCount > 0 && (
            <span style={{ 
              background: 'var(--accent-blue)', 
              color: '#000', 
              fontSize: '0.7rem', 
              padding: '0.1rem 0.45rem', 
              borderRadius: '999px',
              fontWeight: 700 
            }}>
              {savedPassesCount}
            </span>
          )}
        </button>

        <button 
          className="btn btn-secondary"
          onClick={onOpenAppleDevModal}
          title="Configure Apple Developer Pass Type ID & Certificate"
        >
          <Key size={16} style={{ color: 'var(--accent-amber)' }} />
          <span>Apple Dev Account</span>
        </button>

        <button 
          className="btn btn-secondary btn-icon"
          onClick={onResetPass}
          title="Reset pass design to default"
        >
          <RotateCcw size={16} />
        </button>

        <button 
          className="btn btn-primary"
          onClick={onOpenExport}
        >
          <Download size={16} />
          <span>Export Pass</span>
        </button>
      </div>
    </header>
  );
};
