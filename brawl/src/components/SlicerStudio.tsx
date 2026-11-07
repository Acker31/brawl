import { useState, useEffect } from 'react';
import { CharacterIconData, SlicingCoord } from '../types';
import { CHARACTERS, GRID_IMAGE_PATH } from '../data/characters';
import { sliceCharacterIcon, exportAllIconsZip, downloadBlob } from '../utils/slicer';
import { playClickSound, playSelectSound, playFanfareSound } from '../utils/soundEffects';
import { Download, Sliders, RefreshCw, Check, Sparkles, Image as ImageIcon, Circle, Square } from 'lucide-react';

interface SlicerStudioProps {
  selectedCharacter: CharacterIconData;
  onSelectCharacter: (char: CharacterIconData) => void;
}

export function SlicerStudio({ selectedCharacter, onSelectCharacter }: SlicerStudioProps) {
  const [cropOverride, setCropOverride] = useState<Record<string, SlicingCoord>>({});
  const [currentCrop, setCurrentCrop] = useState<SlicingCoord>(selectedCharacter.crop);
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [targetSize, setTargetSize] = useState<number>(512);
  const [isCircular, setIsCircular] = useState<boolean>(true);
  const [includeBorder, setIncludeBorder] = useState<boolean>(false);
  const [borderColor, setBorderColor] = useState<string>('#fbbf24');
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);
  const [zipProgress, setZipProgress] = useState<{ percent: number; label: string } | null>(null);

  // Sync crop when selected character changes
  useEffect(() => {
    const saved = cropOverride[selectedCharacter.id] || selectedCharacter.crop;
    setCurrentCrop(saved);
  }, [selectedCharacter, cropOverride]);

  // Update preview canvas whenever crop or options change
  useEffect(() => {
    let active = true;
    sliceCharacterIcon(GRID_IMAGE_PATH, currentCrop, {
      size: targetSize,
      isCircular,
      includeBorder,
      borderColor,
    })
      .then((url) => {
        if (active) setPreviewDataUrl(url);
      })
      .catch((err) => console.error('Crop slice failed', err));

    return () => {
      active = false;
    };
  }, [currentCrop, targetSize, isCircular, includeBorder, borderColor]);

  const handleCoordinateChange = (key: keyof SlicingCoord, val: number) => {
    const updated = { ...currentCrop, [key]: Number(val) };
    setCurrentCrop(updated);
    setCropOverride((prev) => ({
      ...prev,
      [selectedCharacter.id]: updated,
    }));
  };

  const handleResetCrop = () => {
    playClickSound();
    setCurrentCrop(selectedCharacter.crop);
    setCropOverride((prev) => {
      const next = { ...prev };
      delete next[selectedCharacter.id];
      return next;
    });
  };

  const handleDownloadSingle = () => {
    playSelectSound();
    if (!previewDataUrl) return;
    const a = document.createElement('a');
    a.href = previewDataUrl;
    const shape = isCircular ? 'circle' : 'square';
    a.download = `${selectedCharacter.id}_${selectedCharacter.name.replace(/[^a-zA-Z0-9]/g, '_')}_${shape}_${targetSize}px.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportAllZip = async () => {
    playSelectSound();
    setIsExportingZip(true);
    setZipProgress({ percent: 10, label: 'Initializing icon slicer...' });

    try {
      // Build characters with any customized overrides
      const charactersToExport = CHARACTERS.map((char) => ({
        ...char,
        crop: cropOverride[char.id] || char.crop,
      }));

      const zipBlob = await exportAllIconsZip(
        GRID_IMAGE_PATH,
        charactersToExport,
        {
          size: targetSize,
          isCircular,
          includeBorder,
          borderColor,
        },
        (percent, label) => {
          setZipProgress({ percent, label });
        }
      );

      downloadBlob(zipBlob, `BrawlGrid_13_Arcade_Icons_${targetSize}px.zip`);
      playFanfareSound();
    } catch (err) {
      console.error('Failed to export zip', err);
    } finally {
      setIsExportingZip(false);
      setZipProgress(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and Intro */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Interactive Avatar Slicing Studio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Crop, calibrate, and export crisp standalone circular PNG avatars with alpha transparency from the 13-icon grid sheet.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportAllZip}
          disabled={isExportingZip}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 disabled:opacity-50 rounded-xl shadow-lg shadow-amber-500/20 border border-yellow-300/40 transition-all cursor-pointer whitespace-nowrap active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>{isExportingZip ? 'Packing 13 Icons...' : 'Batch Slice & Export All 13 (.ZIP)'}</span>
        </button>
      </div>

      {/* Progress Bar if Exporting */}
      {zipProgress && (
        <div className="bg-slate-900/90 border border-amber-400/40 p-4 rounded-xl space-y-2 shadow-xl animate-pulse">
          <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
            <span>{zipProgress.label}</span>
            <span className="font-mono">{zipProgress.percent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              style={{ width: `${zipProgress.percent}%` }}
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-300"
            />
          </div>
        </div>
      )}

      {/* Main Slicing Workspace: Left Preview, Right Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Cropped Avatar Viewport */}
        <div className="lg:col-span-5 bg-[#0e121a] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center space-y-6 shadow-xl relative overflow-hidden">
          {/* Subtle Grid Pattern Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, #3b4252 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* Rarity & ID Badge */}
          <div className="flex items-center justify-between w-full z-10">
            <span className="font-arcade text-xs font-bold text-amber-400 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20">
              {selectedCharacter.id}
            </span>
            <span className="text-xs font-semibold text-slate-300">
              {selectedCharacter.rarity} · {selectedCharacter.classType}
            </span>
          </div>

          {/* Canvas Rendered Preview */}
          <div className="relative z-10 flex items-center justify-center">
            {previewDataUrl ? (
              <div
                className={`relative transition-all duration-200 ${
                  isCircular ? 'rounded-full' : 'rounded-3xl'
                } p-2 bg-[#171b26] border-2 border-slate-700/80 shadow-2xl shadow-black/80`}
              >
                <img
                  src={previewDataUrl}
                  alt={`${selectedCharacter.name} cropped avatar`}
                  className={`w-64 h-64 object-contain ${
                    isCircular ? 'rounded-full' : 'rounded-2xl'
                  }`}
                />
              </div>
            ) : (
              <div className="w-64 h-64 rounded-full bg-slate-800/60 animate-pulse flex items-center justify-center text-slate-500 text-xs">
                Rendering slice...
              </div>
            )}
          </div>

          {/* Character Name & Action */}
          <div className="text-center z-10 space-y-1">
            <h3 className="font-arcade text-xl font-bold text-white tracking-tight">
              {selectedCharacter.name}
            </h3>
            <p className="text-xs text-slate-400">{selectedCharacter.tagline}</p>
          </div>

          {/* Download Single Avatar Button */}
          <button
            type="button"
            onClick={handleDownloadSingle}
            className="w-full z-10 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res PNG ({targetSize}x{targetSize})</span>
          </button>
        </div>

        {/* Right: Slicing Options & Coordinate Calibration */}
        <div className="lg:col-span-7 space-y-6">
          {/* Format & Style Options */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              1. Avatar Format & Resolution
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Shape Selection */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-400">Mask Geometry:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setIsCircular(true);
                    }}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isCircular
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <Circle className="w-3.5 h-3.5" />
                    <span>Circular Clip</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setIsCircular(false);
                    }}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      !isCircular
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                    }`}
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>Square Tile</span>
                  </button>
                </div>
              </div>

              {/* Resolution Picker */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-400">Resolution:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[256, 512, 1024].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setTargetSize(sz);
                      }}
                      className={`py-2 px-2 text-center rounded-lg text-xs font-mono font-semibold border transition-all cursor-pointer ${
                        targetSize === sz
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                      }`}
                    >
                      {sz}px
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Extra Outer Frame Option */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeBorder}
                  onChange={(e) => setIncludeBorder(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-amber-400 focus:ring-0 cursor-pointer"
                />
                <span>Add Extra Glossy Arcade Ring Border</span>
              </label>

              {includeBorder && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Ring Color:</span>
                  <div className="flex items-center gap-1.5">
                    {['#fbbf24', '#06b6d4', '#ec4899', '#10b981', '#a855f7'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setBorderColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer ${
                          borderColor === c ? 'scale-125 border-white' : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Slicing Calibration Sliders */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                2. Slice Alignment & Radius Calibration
              </h4>
              <button
                type="button"
                onClick={handleResetCrop}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset to Default</span>
              </button>
            </div>

            <div className="space-y-4">
              {/* Center X */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Horizontal Center (CX):</span>
                  <span className="font-mono text-slate-200 font-semibold">{currentCrop.cx.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  step="0.1"
                  value={currentCrop.cx}
                  onChange={(e) => handleCoordinateChange('cx', parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Center Y */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Vertical Center (CY):</span>
                  <span className="font-mono text-slate-200 font-semibold">{currentCrop.cy.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  step="0.1"
                  value={currentCrop.cy}
                  onChange={(e) => handleCoordinateChange('cy', parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Radius */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Crop Radius:</span>
                  <span className="font-mono text-slate-200 font-semibold">{currentCrop.radius.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="0.1"
                  value={currentCrop.radius}
                  onChange={(e) => handleCoordinateChange('radius', parseFloat(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Quick Character Thumbnails Grid */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Switch Character for Slicing:
            </span>
            <div className="grid grid-cols-7 sm:grid-cols-13 gap-2">
              {CHARACTERS.map((char) => {
                const isSelected = selectedCharacter.id === char.id;
                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      onSelectCharacter(char);
                    }}
                    className={`py-2 px-1 text-center rounded-xl border text-xs font-arcade font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-105'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {char.id}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
