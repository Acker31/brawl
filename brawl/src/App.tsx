import { useState } from 'react';
import { CHARACTERS } from './data/characters';
import { CharacterIconData } from './types';
import { Navbar } from './components/Navbar';
import { ArenaTab } from './components/ArenaTab';
import { GridSheetViewer } from './components/GridSheetViewer';
import { SlicerStudio } from './components/SlicerStudio';
import { BattleCardMaker } from './components/BattleCardMaker';
import { ManifestSpecs } from './components/ManifestSpecs';
import { ExportModal } from './components/ExportModal';
import { playClickSound } from './utils/soundEffects';

export default function App() {
  const [activeTab, setActiveTab] = useState<'arena' | 'grid' | 'slicer' | 'cards' | 'specs'>('arena');
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterIconData>(CHARACTERS[0]);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const handleOpenSlicerForChar = (char: CharacterIconData) => {
    setSelectedCharacter(char);
    setActiveTab('slicer');
  };

  const handleOpenBattleCardForChar = (char: CharacterIconData) => {
    setSelectedCharacter(char);
    setActiveTab('cards');
  };

  return (
    <div className="min-h-screen bg-[#121620] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navigation Bar following 3-Zone Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportPack={() => setIsExportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 w-full mx-auto ${
          activeTab === 'arena'
            ? 'max-w-full px-2 sm:px-3.5 py-2 space-y-2.5'
            : 'max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-8'
        }`}
      >
        {/* Tab 1: Classroom RPS Battle Arena (16:9 Widescreen TV Layout) */}
        {activeTab === 'arena' && <ArenaTab />}

        {/* Tab 2: Full 13-Icon Grid Sheet Viewer */}
        {activeTab === 'grid' && (
          <GridSheetViewer
            selectedCharacter={selectedCharacter}
            onSelectCharacter={setSelectedCharacter}
            onOpenSlicer={handleOpenSlicerForChar}
            onOpenBattleCard={handleOpenBattleCardForChar}
          />
        )}

        {/* Tab 3: Avatar Slicer Studio */}
        {activeTab === 'slicer' && (
          <SlicerStudio
            selectedCharacter={selectedCharacter}
            onSelectCharacter={setSelectedCharacter}
          />
        )}

        {/* Tab 4: Arcade Battle Card & Player Profile Maker */}
        {activeTab === 'cards' && (
          <BattleCardMaker
            selectedCharacter={selectedCharacter}
            onSelectCharacter={setSelectedCharacter}
          />
        )}

        {/* Tab 5: Technical Specs & Engine Manifest */}
        {activeTab === 'specs' && <ManifestSpecs />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0d1017] px-6 py-5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-arcade text-amber-400 font-bold">BRAWL GRID</span>
            <span>·</span>
            <span>13-Character Arcade Game Profile Icon Grid Suite</span>
            <span>·</span>
            <span className="text-slate-400">Brawl Stars Art Aesthetic</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Rows: 5-5-3 Layout</span>
            <span>·</span>
            <span>Icons: P1 to P13</span>
            <span>·</span>
            <span>Thick Outlines · Chunky Proportions · Tactile Shading · Neon Palettes</span>
          </div>
        </div>
      </footer>

      {/* Export Asset Pack Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}
