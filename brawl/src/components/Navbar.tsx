import { Download, Volume2, VolumeX } from 'lucide-react';
import { isAudioMuted, setAudioMuted, playClickSound } from '../utils/soundEffects';
import { useState } from 'react';

interface NavbarProps {
  activeTab: 'arena' | 'grid' | 'slicer' | 'cards' | 'specs';
  setActiveTab: (tab: 'arena' | 'grid' | 'slicer' | 'cards' | 'specs') => void;
  onExportPack: () => void;
}

export function Navbar({ activeTab, setActiveTab, onExportPack }: NavbarProps) {
  const [muted, setMuted] = useState(isAudioMuted());

  const handleToggleSound = () => {
    const next = !muted;
    setAudioMuted(next);
    setMuted(next);
    if (!next) {
      playClickSound();
    }
  };

  const handleTabClick = (tab: 'arena' | 'grid' | 'slicer' | 'cards' | 'specs') => {
    playClickSound();
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#121620]/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300/30">
            <span className="font-arcade text-lg font-black text-slate-950 tracking-tighter">13</span>
          </div>
          <span className="font-arcade text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            Brawl Grid
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
            Arcade Suite
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            type="button"
            onClick={() => handleTabClick('arena')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 flex items-center gap-1.5 ${
              activeTab === 'arena'
                ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                : 'hover:text-white'
            }`}
          >
            <span>Arena (16:9 TV)</span>
            <span className="bg-rose-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
              Live
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('grid')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 ${
              activeTab === 'grid'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Icon Grid Sheet
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('slicer')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 ${
              activeTab === 'slicer'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Avatar Slicer
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('cards')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 ${
              activeTab === 'cards'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Battle Cards
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('specs')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 ${
              activeTab === 'specs'
                ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Asset Specs
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Sound Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleToggleSound}
            title={muted ? 'Unmute arcade sound effects' : 'Mute sound effects'}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            type="button"
            onClick={onExportPack}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 rounded-lg shadow-md shadow-amber-500/20 border border-yellow-300/40 transition-all cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export 13-Pack ZIP</span>
          </button>
        </div>
      </div>
    </header>
  );
}
