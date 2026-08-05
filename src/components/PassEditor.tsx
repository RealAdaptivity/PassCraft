import React, { useState } from 'react';
import { ApplePassData, PassField, PassType, BarcodeFormat } from '../types/pass';
import { 
  Palette, 
  Layers, 
  QrCode, 
  FileText, 
  Settings, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Plane,
  Ticket,
  CreditCard,
  Tag,
  ShieldCheck
} from 'lucide-react';

interface PassEditorProps {
  passData: ApplePassData;
  onUpdatePass: (updated: Partial<ApplePassData>) => void;
}

export const PassEditor: React.FC<PassEditorProps> = ({ passData, onUpdatePass }) => {
  const [activeTab, setActiveTab] = useState<'branding' | 'fields' | 'barcode' | 'back' | 'settings'>('branding');

  // Helpers to update fields array
  const updateFieldInSection = (
    section: 'headerFields' | 'primaryFields' | 'secondaryFields' | 'auxiliaryFields' | 'backFields',
    index: number,
    updatedField: Partial<PassField>
  ) => {
    const list = [...passData[section]];
    list[index] = { ...list[index], ...updatedField };
    onUpdatePass({ [section]: list });
  };

  const addFieldToSection = (section: 'headerFields' | 'primaryFields' | 'secondaryFields' | 'auxiliaryFields' | 'backFields') => {
    const id = `field_${Date.now()}`;
    const newField: PassField = {
      id,
      key: `field_${passData[section].length + 1}`,
      label: 'NEW FIELD',
      value: 'Sample Value'
    };
    onUpdatePass({ [section]: [...passData[section], newField] });
  };

  const removeFieldFromSection = (
    section: 'headerFields' | 'primaryFields' | 'secondaryFields' | 'auxiliaryFields' | 'backFields',
    index: number
  ) => {
    const list = passData[section].filter((_, i) => i !== index);
    onUpdatePass({ [section]: list });
  };

  return (
    <div className="editor-pane">
      <div className="panel-card">
        <h2 className="panel-title">
          <Settings size={20} style={{ color: 'var(--accent-blue)' }} />
          Pass Customization Studio
        </h2>

        {/* Navigation Tabs */}
        <div className="tabs-navigation" style={{ marginBottom: '1.5rem' }}>
          <button 
            className={`tab-button ${activeTab === 'branding' ? 'active' : ''}`}
            onClick={() => setActiveTab('branding')}
          >
            <Palette size={16} />
            <span>Branding & Colors</span>
          </button>

          <button 
            className={`tab-button ${activeTab === 'fields' ? 'active' : ''}`}
            onClick={() => setActiveTab('fields')}
          >
            <Layers size={16} />
            <span>Pass Fields</span>
          </button>

          <button 
            className={`tab-button ${activeTab === 'barcode' ? 'active' : ''}`}
            onClick={() => setActiveTab('barcode')}
          >
            <QrCode size={16} />
            <span>QR & Barcode</span>
          </button>

          <button 
            className={`tab-button ${activeTab === 'back' ? 'active' : ''}`}
            onClick={() => setActiveTab('back')}
          >
            <FileText size={16} />
            <span>Back Side</span>
          </button>

          <button 
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <ShieldCheck size={16} />
            <span>Apple PassKit Settings</span>
          </button>
        </div>

        {/* ================= TAB 1: BRANDING & COLORS ================= */}
        {activeTab === 'branding' && (
          <div>
            <div className="form-group">
              <label className="form-label">Pass Title / Name</label>
              <input 
                type="text" 
                className="form-input"
                value={passData.title}
                onChange={e => onUpdatePass({ title: e.target.value })}
                placeholder="e.g. VIP Festival Pass"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Organization Name</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={passData.organizationName}
                  onChange={e => onUpdatePass({ organizationName: e.target.value })}
                  placeholder="e.g. Neon Wave Events"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Logo Header Text</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={passData.logoText}
                  onChange={e => onUpdatePass({ logoText: e.target.value })}
                  placeholder="e.g. NEON FEST"
                />
              </div>
            </div>

            <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.75rem' }}>Color Palette</label>
              <div className="color-picker-row">
                <div className="color-input-wrapper">
                  <input 
                    type="color" 
                    className="color-swatch-input"
                    value={passData.backgroundColor.startsWith('#') ? passData.backgroundColor : '#0f172a'}
                    onChange={e => onUpdatePass({ backgroundColor: e.target.value })}
                  />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Background</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{passData.backgroundColor}</div>
                  </div>
                </div>

                <div className="color-input-wrapper">
                  <input 
                    type="color" 
                    className="color-swatch-input"
                    value={passData.foregroundColor.startsWith('#') ? passData.foregroundColor : '#ffffff'}
                    onChange={e => onUpdatePass({ foregroundColor: e.target.value })}
                  />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Text / Value</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{passData.foregroundColor}</div>
                  </div>
                </div>

                <div className="color-input-wrapper">
                  <input 
                    type="color" 
                    className="color-swatch-input"
                    value={passData.labelColor.startsWith('#') ? passData.labelColor : '#38bdf8'}
                    onChange={e => onUpdatePass({ labelColor: e.target.value })}
                  />
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Labels</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{passData.labelColor}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ImageIcon size={14} />
                <span>Strip Banner Image URL (Optional)</span>
              </label>
              <input 
                type="text" 
                className="form-input"
                value={passData.stripImage || ''}
                onChange={e => onUpdatePass({ stripImage: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Displays a hero background strip across the upper portion of the pass card.
              </span>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PASS FIELDS ================= */}
        {activeTab === 'fields' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header Fields */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Header Fields (Top Right)</span>
                {passData.headerFields.length < 2 && (
                  <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => addFieldToSection('headerFields')}>
                    <Plus size={14} /> Add Header Field
                  </button>
                )}
              </div>
              {passData.headerFields.map((field, idx) => (
                <div key={field.id} className="field-editor-item">
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Label (e.g. GATE)" 
                    value={field.label} 
                    onChange={e => updateFieldInSection('headerFields', idx, { label: e.target.value })}
                  />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Value (e.g. B24)" 
                    value={field.value} 
                    onChange={e => updateFieldInSection('headerFields', idx, { value: e.target.value })}
                  />
                  <button className="btn btn-secondary btn-icon" onClick={() => removeFieldFromSection('headerFields', idx)}>
                    <Trash2 size={14} style={{ color: 'var(--accent-rose)' }} />
                  </button>
                </div>
              ))}
            </div>

            {/* Primary Fields */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Primary Fields (Main Big Headline)</span>
                {passData.primaryFields.length < 2 && (
                  <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => addFieldToSection('primaryFields')}>
                    <Plus size={14} /> Add Primary Field
                  </button>
                )}
              </div>
              {passData.primaryFields.map((field, idx) => (
                <div key={field.id} className="field-editor-item">
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Label (e.g. EVENT)" 
                    value={field.label} 
                    onChange={e => updateFieldInSection('primaryFields', idx, { label: e.target.value })}
                  />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Value (e.g. NEON FESTIVAL)" 
                    value={field.value} 
                    onChange={e => updateFieldInSection('primaryFields', idx, { value: e.target.value })}
                  />
                  <button className="btn btn-secondary btn-icon" onClick={() => removeFieldFromSection('primaryFields', idx)}>
                    <Trash2 size={14} style={{ color: 'var(--accent-rose)' }} />
                  </button>
                </div>
              ))}
            </div>

            {/* Secondary Fields */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Secondary Fields (Middle Grid)</span>
                {passData.secondaryFields.length < 4 && (
                  <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => addFieldToSection('secondaryFields')}>
                    <Plus size={14} /> Add Field
                  </button>
                )}
              </div>
              {passData.secondaryFields.map((field, idx) => (
                <div key={field.id} className="field-editor-item">
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Label (e.g. HOLDER)" 
                    value={field.label} 
                    onChange={e => updateFieldInSection('secondaryFields', idx, { label: e.target.value })}
                  />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Value (e.g. ALEX MORGAN)" 
                    value={field.value} 
                    onChange={e => updateFieldInSection('secondaryFields', idx, { value: e.target.value })}
                  />
                  <button className="btn btn-secondary btn-icon" onClick={() => removeFieldFromSection('secondaryFields', idx)}>
                    <Trash2 size={14} style={{ color: 'var(--accent-rose)' }} />
                  </button>
                </div>
              ))}
            </div>

            {/* Auxiliary Fields */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Auxiliary Fields (Lower Grid)</span>
                {passData.auxiliaryFields.length < 4 && (
                  <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => addFieldToSection('auxiliaryFields')}>
                    <Plus size={14} /> Add Field
                  </button>
                )}
              </div>
              {passData.auxiliaryFields.map((field, idx) => (
                <div key={field.id} className="field-editor-item">
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Label (e.g. DATE)" 
                    value={field.label} 
                    onChange={e => updateFieldInSection('auxiliaryFields', idx, { label: e.target.value })}
                  />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Value (e.g. AUG 15-17)" 
                    value={field.value} 
                    onChange={e => updateFieldInSection('auxiliaryFields', idx, { value: e.target.value })}
                  />
                  <button className="btn btn-secondary btn-icon" onClick={() => removeFieldFromSection('auxiliaryFields', idx)}>
                    <Trash2 size={14} style={{ color: 'var(--accent-rose)' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: QR & BARCODE ================= */}
        {activeTab === 'barcode' && (
          <div>
            <div className="form-group">
              <label className="form-label">Barcode / QR Code Content (URL or Text)</label>
              <textarea 
                className="form-textarea"
                value={passData.barcode.message}
                onChange={e => onUpdatePass({ barcode: { ...passData.barcode, message: e.target.value } })}
                placeholder="https://yourdomain.com/ticket/verify?id=12345"
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                This is the raw data encoded inside the QR code or barcode when scanned by a smartphone camera or ticket scanner.
              </span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Barcode Format</label>
                <select 
                  className="form-select"
                  value={passData.barcode.format}
                  onChange={e => onUpdatePass({ barcode: { ...passData.barcode, format: e.target.value as BarcodeFormat } })}
                >
                  <option value="PKBarcodeFormatQR">QR Code (Standard)</option>
                  <option value="PKBarcodeFormatAztec">Aztec Code</option>
                  <option value="PKBarcodeFormatPDF417">PDF417 (Boarding Pass standard)</option>
                  <option value="PKBarcodeFormatCode128">Code128 (Retail barcode)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Alt Text (Human Readable Code)</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={passData.barcode.altText || ''}
                  onChange={e => onUpdatePass({ barcode: { ...passData.barcode, altText: e.target.value } })}
                  placeholder="e.g. NW-VIP-98234"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">QR Density / Error Correction Level</label>
              <select 
                className="form-select"
                value={passData.barcode.errorCorrectionLevel || 'M'}
                onChange={e => onUpdatePass({ barcode: { ...passData.barcode, errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H' } })}
              >
                <option value="M">Medium (Standard - 15% recovery, matching DRB card grid)</option>
                <option value="L">Low (1-2 Module Grid - 7% recovery)</option>
                <option value="Q">Quartile (25% recovery)</option>
                <option value="H">High (Dense Grid - 30% recovery)</option>
              </select>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Adjusts the physical pixel grid density of the QR code to match your DRB card version.
              </span>
            </div>
          </div>
        )}

        {/* ================= TAB 4: CARD BACK SIDE ================= */}
        {activeTab === 'back' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Card Back Fields (Terms, Links & Rules)</span>
              <button className="btn btn-secondary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => addFieldToSection('backFields')}>
                <Plus size={14} /> Add Back Info Field
              </button>
            </div>

            {passData.backFields.map((field, idx) => (
              <div key={field.id} style={{ background: 'var(--bg-primary)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Heading (e.g. TERMS & CONDITIONS)" 
                    value={field.label} 
                    onChange={e => updateFieldInSection('backFields', idx, { label: e.target.value })}
                  />
                  <button className="btn btn-secondary btn-icon" onClick={() => removeFieldFromSection('backFields', idx)}>
                    <Trash2 size={14} style={{ color: 'var(--accent-rose)' }} />
                  </button>
                </div>
                <textarea 
                  className="form-textarea"
                  style={{ minHeight: '60px', fontSize: '0.8rem' }}
                  placeholder="Detailed description, terms, contact email, or support website..."
                  value={field.value}
                  onChange={e => updateFieldInSection('backFields', idx, { value: e.target.value })}
                />
              </div>
            ))}
          </div>
        )}

        {/* ================= TAB 5: PASSKIT SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div>
            <div className="form-group">
              <label className="form-label">Apple Pass Style Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem', marginTop: '0.25rem' }}>
                {[
                  { type: 'eventTicket', label: 'Event Ticket', icon: Ticket },
                  { type: 'boardingPass', label: 'Boarding Pass', icon: Plane },
                  { type: 'storeCard', label: 'Store Card', icon: CreditCard },
                  { type: 'coupon', label: 'Coupon', icon: Tag },
                  { type: 'generic', label: 'Generic Pass', icon: Layers },
                ].map((item) => {
                  const IconComp = item.icon;
                  const isSelected = passData.passType === item.type;
                  return (
                    <button
                      key={item.type}
                      className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => onUpdatePass({ passType: item.type as PassType })}
                      style={{ padding: '0.6rem 0.5rem', fontSize: '0.75rem', flexDirection: 'column', gap: '0.3rem' }}
                    >
                      <IconComp size={16} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Pass Type Identifier</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={passData.passTypeIdentifier}
                  onChange={e => onUpdatePass({ passTypeIdentifier: e.target.value })}
                  placeholder="pass.com.company.app"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Apple Team ID</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={passData.teamIdentifier}
                  onChange={e => onUpdatePass({ teamIdentifier: e.target.value })}
                  placeholder="e.g. A1B2C3D4E5"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Serial Number</label>
              <input 
                type="text" 
                className="form-input"
                value={passData.serialNumber}
                onChange={e => onUpdatePass({ serialNumber: e.target.value })}
                placeholder="PASS-123456"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
