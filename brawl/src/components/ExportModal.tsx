import { useState } from 'react';
import { CHARACTERS, GRID_IMAGE_PATH } from '../data/characters';
import { exportAllIconsZip, downloadBlob } from '../utils/slicer';
import { playClickSound, playSelectSound, playFanfareSound } from '../utils/soundEffects';
import { X, Download, Archive, Check, Sparkles, FileImage, ShieldCheck } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const [resolution, setResolution] = useState<number>(512);
  const [shape, setShape] = useState<'circle' | 'square'>('circle');
  const [includeManifest, setIncludeManifest] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ percent: number; label: string } | null>(null);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    playSelectSound();
    setIsExporting(true);
    setProgress({ percent: 10, label: 'Cropping 13 high-res icons...' });

    try {
      const blob = await exportAllIconsZip(
        GRID_IMAGE_PATH,
        CHARACTERS,
        {
          size: resolution,
          isCircular: shape === 'circle',
          includeBorder: false,
        },
        (percent, label) => {
          setProgress({ percent, label });
        }
      );

      downloadBlob(blob, `BrawlGrid_13_Arcade_Avatars_${resolution}px.zip`);
      playFanfareSound();
      setTimeout(() => {
        onClose();
        setIsExporting(false);
        setProgress(null);
      }, 800);
    } catch (err) {
      console.error('Export failed', err);
      setIsExporting(false);
      setProgress(null);
    }
  };

  const handleDownloadFullSheet = () => {
    playClickSound();
    const a = document.createElement('a');
    a.href = GRID_IMAGE_PATH;
    a.download = 'BrawlGrid_13_Arcade_FullSheet_16x9.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121622] rounded-2xl border border-slate-700/80 max-w-lg w-full p-6 shadow-2xl space-y-6 relative">
        {/* Close button */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-amber-400" />
            <h3 className="font-arcade text-lg font-bold text-white">
              Export 13-Character Asset Pack
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Package all 13 arcade profile avatars into a clean ZIP archive with transparent PNGs and engine manifest.
          </p>
        </div>

        {/* Export Options */}
        <div className="space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          {/* Resolution Picker */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-300">Avatar Resolution:</span>
            <div className="grid grid-cols-3 gap-2">
              {[256, 512, 1024].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setResolution(sz);
                  }}
                  className={`py-2 text-center rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                    resolution === sz
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  {sz}x{sz} px
                </button>
              ))}
            </div>
          </div>

          {/* Mask Shape */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-300">Mask Geometry:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setShape('circle');
                }}
                className={`py-2 text-center rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  shape === 'circle'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                Circular (Alpha Transparent)
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setShape('square');
                }}
                className={`py-2 text-center rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  shape === 'square'
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                Square Tile
              </button>
            </div>
          </div>

          {/* Package Inclusions Checklist */}
          <div className="space-y-1 pt-2 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>13 Standalone PNG Files (P1_Unit-T1G3R ... P13_Shadow_Raccoon)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Included manifest.json with coordinates and game stats</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {progress && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-amber-300">
              <span>{progress.label}</span>
              <span className="font-mono">{progress.percent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${progress.percent}%` }}
                className="h-full bg-amber-400 transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={isExporting}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all shadow-lg shadow-amber-500/20 border border-yellow-300/40 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating ZIP...' : 'Download 13-Icon ZIP Archive'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadFullSheet}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 transition-colors border border-slate-700 cursor-pointer flex items-center justify-center gap-2"
          >
            <FileImage className="w-4 h-4 text-sky-400" />
            <span>Download Full 16:9 Grid Sheet Image</span>
          </button>
        </div>
      </div>
    </div>
  );
}
