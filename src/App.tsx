import React, { useState, useEffect } from 'react';
import { Eye, Sliders, Download, LayoutGrid, Bookmark } from 'lucide-react';
import { ApplePassData, TemplatePreset } from './types/pass';
import { DEFAULT_PASS } from './utils/defaults';
import { Header } from './components/Header';
import { PassPreview } from './components/PassPreview';
import { PassEditor } from './components/PassEditor';
import { TemplateGallery } from './components/TemplateGallery';
import { ExportModal } from './components/ExportModal';
import { SavedPasses } from './components/SavedPasses';
import { AppleDevGuideModal } from './components/AppleDevGuideModal';
import { ScannerSimulator } from './components/ScannerSimulator';

export const App: React.FC = () => {
  const [passData, setPassData] = useState<ApplePassData>(() => {
    // Check if pass URL parameter exists
    const urlParams = new URLSearchParams(window.location.search);
    const passParam = urlParams.get('pass');
    if (passParam) {
      try {
        const decoded = decodeURIComponent(atob(passParam));
        const parsed = JSON.parse(decoded) as ApplePassData;
        return { ...parsed, id: `pass_${Date.now()}` };
      } catch (err) {
        console.error('Failed to parse URL pass parameter:', err);
      }
    }
    return DEFAULT_PASS;
  });

  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [savedPasses, setSavedPasses] = useState<ApplePassData[]>(() => {
    try {
      const stored = localStorage.getItem('passcraft_saved_passes');
      return stored ? JSON.parse(stored) : [DEFAULT_PASS];
    } catch {
      return [DEFAULT_PASS];
    }
  });

  // Active Modals
  const [activeModal, setActiveModal] = useState<'templates' | 'export' | 'saved' | 'appleDev' | 'simulator' | null>(null);

  // Sync saved passes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('passcraft_saved_passes', JSON.stringify(savedPasses));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, [savedPasses]);

  const handleUpdatePass = (updated: Partial<ApplePassData>) => {
    setPassData(prev => ({
      ...prev,
      ...updated,
      updatedAt: Date.now()
    }));
  };

  const handleSelectTemplate = (preset: TemplatePreset) => {
    setPassData(prev => ({
      ...prev,
      ...preset.passData,
      id: `pass_${preset.id}_${Date.now()}`,
      title: preset.name,
      updatedAt: Date.now()
    }));
    setIsFlipped(false);
  };

  const handleSaveCurrentPass = () => {
    const existingIndex = savedPasses.findIndex(p => p.id === passData.id);
    if (existingIndex >= 0) {
      const updatedList = [...savedPasses];
      updatedList[existingIndex] = { ...passData, updatedAt: Date.now() };
      setSavedPasses(updatedList);
    } else {
      setSavedPasses(prev => [{ ...passData, updatedAt: Date.now() }, ...prev]);
    }
  };

  const handleDuplicatePass = (pass: ApplePassData) => {
    const duplicated: ApplePassData = {
      ...pass,
      id: `pass_copy_${Date.now()}`,
      title: `${pass.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setSavedPasses(prev => [duplicated, ...prev]);
  };

  const handleDeletePass = (id: string) => {
    setSavedPasses(prev => prev.filter(p => p.id !== id));
  };

  const handleResetPass = () => {
    if (confirm('Reset pass design to default settings?')) {
      setPassData({ ...DEFAULT_PASS, id: `pass_default_${Date.now()}` });
      setIsFlipped(false);
    }
  };

  // Mobile tab state
  const [mobileTab, setMobileTab] = useState<'preview' | 'edit'>('preview');

  return (
    <div className="app-container">
      <Header 
        onOpenTemplates={() => setActiveModal('templates')}
        onOpenExport={() => setActiveModal('export')}
        onOpenSaved={() => setActiveModal('saved')}
        onOpenAppleDevModal={() => setActiveModal('appleDev')}
        onResetPass={handleResetPass}
        savedPassesCount={savedPasses.length}
      />

      <main className={`workspace-grid ${mobileTab === 'edit' ? 'show-editor' : 'show-preview'}`}>
        {/* Sticky 3D Preview Column */}
        <PassPreview 
          passData={passData}
          isFlipped={isFlipped}
          onToggleFlip={() => setIsFlipped(!isFlipped)}
          onOpenSimulator={() => setActiveModal('simulator')}
        />

        {/* Studio Editor Column */}
        <PassEditor 
          passData={passData}
          onUpdatePass={handleUpdatePass}
        />
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="mobile-tab-bar">
        <button
          className={`mobile-tab-btn ${mobileTab === 'preview' ? 'active' : ''}`}
          onClick={() => setMobileTab('preview')}
        >
          <Eye />
          Preview
        </button>
        <button
          className={`mobile-tab-btn ${mobileTab === 'edit' ? 'active' : ''}`}
          onClick={() => setMobileTab('edit')}
        >
          <Sliders />
          Edit
        </button>
        <button
          className="mobile-export-btn"
          onClick={() => setActiveModal('export')}
        >
          <span className="tab-icon-wrap">
            <Download size={18} />
          </span>
          Export
        </button>
        <button
          className="mobile-tab-btn"
          onClick={() => setActiveModal('templates')}
        >
          <LayoutGrid />
          Templates
        </button>
        <button
          className="mobile-tab-btn"
          onClick={() => setActiveModal('saved')}
        >
          <Bookmark />
          Saved
        </button>
      </nav>

      {/* Modals */}
      {activeModal === 'templates' && (
        <TemplateGallery 
          currentPassId={passData.id}
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'export' && (
        <ExportModal 
          passData={passData}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'saved' && (
        <SavedPasses 
          savedPasses={savedPasses}
          onLoadPass={(pass) => {
            setPassData(pass);
            setIsFlipped(false);
          }}
          onDuplicatePass={handleDuplicatePass}
          onDeletePass={handleDeletePass}
          onSaveCurrentPass={handleSaveCurrentPass}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'appleDev' && (
        <AppleDevGuideModal 
          passData={passData}
          onUpdatePass={handleUpdatePass}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'simulator' && (
        <ScannerSimulator 
          passData={passData}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

export default App;
