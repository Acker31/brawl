import { useState } from 'react';
import { CHARACTERS, GRID_IMAGE_PATH, REFERENCE_IMAGE_PATH } from '../data/characters';
import { CharacterIconData } from '../types';
import { playClickSound, playCharacterSound } from '../utils/soundEffects';
import { Eye, ZoomIn, ZoomOut, Maximize2, Shield, Sparkles, Wand2, Compass, Layers, CheckCircle2 } from 'lucide-react';

interface GridSheetViewerProps {
  selectedCharacter: CharacterIconData;
  onSelectCharacter: (char: CharacterIconData) => void;
  onOpenSlicer: (char: CharacterIconData) => void;
  onOpenBattleCard: (char: CharacterIconData) => void;
}

export function GridSheetViewer({
  selectedCharacter,
  onSelectCharacter,
  onOpenSlicer,
  onOpenBattleCard,
}: GridSheetViewerProps) {
  const [activeView, setActiveView] = useState<'generated' | 'reference' | 'split'>('generated');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [hoveredChar, setHoveredChar] = useState<CharacterIconData | null>(null);

  const handleSelect = (char: CharacterIconData) => {
    playCharacterSound(char.soundType);
    onSelectCharacter(char);
  };

  const handleZoom = (delta: number) => {
    playClickSound();
    setZoomLevel((prev) => Math.min(220, Math.max(80, prev + delta)));
  };

  const handleResetZoom = () => {
    playClickSound();
    setZoomLevel(100);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveView('generated');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeView === 'generated'
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Generated 13-Icon Grid (5-5-3)
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveView('reference');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeView === 'reference'
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Style Reference Image
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveView('split');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeView === 'split'
                ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Side-by-Side Compare
          </button>
        </div>

        {/* Viewport & Overlay Controls */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOverlays}
              onChange={(e) => setShowOverlays(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-amber-400 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span>Show Icon Hotspots (P1-P13)</span>
          </label>

          <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => handleZoom(-15)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs font-mono text-slate-300 tabular-nums">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={() => handleZoom(15)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Image Grid Display Canvas */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0d1017] border border-slate-800 p-2 shadow-2xl">
        {activeView === 'split' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Generated Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  New Generated 13-Icon Grid (5-5-3 Layout)
                </span>
                <span className="text-[11px] text-slate-400">P1 to P13 Sheet</span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-800/80 bg-[#161a24]">
                <img
                  src={GRID_IMAGE_PATH}
                  alt="Generated 13-Character Arcade Game Profile Icon Grid"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto block select-none"
                />
              </div>
            </div>

            {/* Reference Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  User Style Reference Art (Brawl Stars UI Style)
                </span>
                <span className="text-[11px] text-slate-400">Reference Asset</span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-800/80 bg-[#161a24]">
                <img
                  src={REFERENCE_IMAGE_PATH}
                  alt="Style Reference 13-Character Icon Sheet"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto block select-none"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative overflow-auto max-h-[720px] flex items-center justify-center p-4">
            <div
              style={{
                width: `${zoomLevel}%`,
                transition: 'width 0.15s ease-out',
              }}
              className="relative max-w-full origin-top"
            >
              <img
                src={activeView === 'generated' ? GRID_IMAGE_PATH : REFERENCE_IMAGE_PATH}
                alt={
                  activeView === 'generated'
                    ? 'Generated 13-Character Arcade Game Profile Icon Grid'
                    : 'Original Style Reference Art'
                }
                referrerPolicy="no-referrer"
                className="w-full h-auto rounded-xl shadow-lg border border-slate-800/90 block select-none"
              />

              {/* Interactive Hotspot Overlays (Only on Generated Sheet) */}
              {activeView === 'generated' && showOverlays && (
                <div className="absolute inset-0 pointer-events-none">
                  {CHARACTERS.map((char) => {
                    const isSelected = selectedCharacter.id === char.id;
                    const isHovered = hoveredChar?.id === char.id;

                    // Compute circle boundaries
                    const leftPercent = char.crop.cx - char.crop.radius;
                    // Because 16:9 aspect ratio: vertical radius percent = horizontal radius * (16 / 9)
                    const verticalRadiusPercent = char.crop.radius * (16 / 9);
                    const topPercent = char.crop.cy - verticalRadiusPercent;
                    const widthPercent = char.crop.radius * 2;
                    const heightPercent = verticalRadiusPercent * 2;

                    return (
                      <div
                        key={char.id}
                        style={{
                          left: `${leftPercent}%`,
                          top: `${topPercent}%`,
                          width: `${widthPercent}%`,
                          height: `${heightPercent}%`,
                        }}
                        className="absolute pointer-events-auto cursor-pointer group"
                        onClick={() => handleSelect(char)}
                        onMouseEnter={() => setHoveredChar(char)}
                        onMouseLeave={() => setHoveredChar(null)}
                      >
                        {/* Interactive Circular Target Ring */}
                        <div
                          className={`w-full h-full rounded-full transition-all duration-200 border-2 ${
                            isSelected
                              ? 'border-amber-400 ring-4 ring-amber-400/40 bg-amber-400/10 shadow-lg shadow-amber-500/30 scale-105'
                              : isHovered
                              ? 'border-cyan-400 ring-2 ring-cyan-400/30 bg-cyan-400/10 scale-102'
                              : 'border-white/20 hover:border-amber-400/70'
                          }`}
                        >
                          {/* Identifier Floating Pill */}
                          <div
                            className={`absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full font-arcade text-[10px] font-bold tracking-tight shadow-md transition-all ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950 scale-110'
                                : 'bg-slate-900/90 text-amber-300 border border-amber-400/30'
                            }`}
                          >
                            {char.id}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Hovered Character Instant Preview Bar */}
        <div className="mt-3 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-arcade text-amber-400 font-bold">
              {hoveredChar ? hoveredChar.id : selectedCharacter.id}:
            </span>
            <span className="text-white font-semibold">
              {hoveredChar ? hoveredChar.name : selectedCharacter.name}
            </span>
            <span className="text-slate-400">
              · {hoveredChar ? hoveredChar.tagline : selectedCharacter.tagline}
            </span>
            <span className="text-slate-500">
              · {hoveredChar ? hoveredChar.classType : selectedCharacter.classType} Class
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenSlicer(hoveredChar || selectedCharacter)}
              className="px-2.5 py-1 text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Slice Avatar
            </button>
            <button
              type="button"
              onClick={() => onOpenBattleCard(hoveredChar || selectedCharacter)}
              className="px-2.5 py-1 text-slate-950 font-bold bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
            >
              Open Battle Card
            </button>
          </div>
        </div>
      </div>

      {/* 13-Character Selector Carousel / Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold uppercase tracking-wider text-slate-300">
            Select Character to Inspect & Slice (P1 to P13)
          </span>
          <span>13 Unique Arcade Archetypes</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-13 gap-2">
          {CHARACTERS.map((char) => {
            const isSelected = selectedCharacter.id === char.id;
            return (
              <button
                key={char.id}
                type="button"
                onClick={() => handleSelect(char)}
                className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400/10 border-amber-400 shadow-md shadow-amber-400/10 translate-y-[-2px]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-arcade font-bold text-xs shadow-inner mb-1.5 transition-colors ${
                    isSelected
                      ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 ring-2 ring-amber-400'
                      : 'bg-slate-800 text-amber-400 border border-slate-700'
                  }`}
                >
                  {char.id}
                </div>
                <span className="text-[11px] font-bold text-slate-200 truncate w-full">
                  {char.name}
                </span>
                <span className="text-[9px] text-slate-400 truncate w-full">
                  {char.classType}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mandatory Style Tokens Compliance Verification Card */}
      <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Mandatory Style Tokens Verified
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/90 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>1. Thick Outlines</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every character features heavy, stylized outer dark borders (&gt;4px) creating sharp silhouette clarity against the neutral canvas.
            </p>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/90 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>2. Chunky Proportions</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Non-realistic, rounded brawler proportions perfectly centered inside circular frames, exuding cheerful arcade charm.
            </p>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/90 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>3. Glossy & Tactile Shading</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smooth surface gradients with luminous rim lighting and inner shadows, rendering each icon like a physical arcade pushbutton.
            </p>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/90 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>4. Vibrant Contrast Palettes</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-saturation neon cyan, electric pink, dragon ember orange, and star sapphire blue with contrasting inset background glows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
