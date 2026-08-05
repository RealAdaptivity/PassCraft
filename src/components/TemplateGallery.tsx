import React from 'react';
import { X, Sparkles, Check } from 'lucide-react';
import { TEMPLATE_PRESETS } from '../utils/defaults';
import { TemplatePreset } from '../types/pass';

interface TemplateGalleryProps {
  currentPassId?: string;
  onSelectTemplate: (preset: TemplatePreset) => void;
  onClose: () => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  currentPassId,
  onSelectTemplate,
  onClose
}) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-blue)' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>
                Pass Preset Templates
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Choose a pre-built design pattern to quickly start customizing your pass
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="templates-grid">
          {TEMPLATE_PRESETS.map((preset) => {
            const isSelected = currentPassId === preset.id;
            const bg = preset.passData.backgroundColor || '#0f172a';
            const fg = preset.passData.foregroundColor || '#ffffff';
            const labelCol = preset.passData.labelColor || '#38bdf8';

            return (
              <div 
                key={preset.id}
                className="template-card"
                onClick={() => {
                  onSelectTemplate(preset);
                  onClose();
                }}
                style={{
                  border: isSelected ? '2px solid var(--accent-blue)' : undefined
                }}
              >
                <div className="template-card-header">
                  <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: 700, 
                    padding: '0.15rem 0.5rem', 
                    borderRadius: '999px',
                    background: 'var(--bg-surface-elevated)',
                    color: 'var(--accent-blue)' 
                  }}>
                    {preset.category}
                  </span>

                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <div className="template-color-preview" style={{ backgroundColor: bg }} title="Background" />
                    <div className="template-color-preview" style={{ backgroundColor: labelCol }} title="Labels" />
                    <div className="template-color-preview" style={{ backgroundColor: fg }} title="Text" />
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                    {preset.name}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {preset.description}
                  </p>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {preset.passData.organizationName}
                  </span>
                  <button className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.3rem 0.65rem', fontSize: '0.7rem' }}>
                    {isSelected ? <Check size={12} /> : 'Use Template'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
