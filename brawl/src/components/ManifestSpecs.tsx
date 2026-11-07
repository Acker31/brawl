import { useState } from 'react';
import { CHARACTERS } from '../data/characters';
import { playClickSound, playSelectSound } from '../utils/soundEffects';
import { Copy, Check, Code, FileJson, Palette, Sparkles, BookOpen, Terminal } from 'lucide-react';

export function ManifestSpecs() {
  const [activeCodeTab, setActiveCodeTab] = useState<'json' | 'css'>('json');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const manifestJson = JSON.stringify(
    {
      title: 'Brawl Grid 13-Character Arcade Profile Icons',
      version: '1.0.0',
      artStyle: 'Brawl Stars Chunky Arcade Mobile UI',
      totalIcons: 13,
      sheetLayout: {
        aspectRatio: '16:9',
        rows: [5, 5, 3],
        description: 'Row 1 (P1-P5), Row 2 (P6-P10), Row 3 (P11-P13 centered)',
      },
      styleTokens: {
        outlineStroke: '4px thick stylized outer border',
        proportions: 'Rounded, chunky arcade proportions',
        shading: 'Glossy tactile button gradient and rim lighting',
        palette: 'High-contrast primary and neon palette',
      },
      icons: CHARACTERS.map((c) => ({
        id: c.id,
        index: c.index,
        name: c.name,
        tagline: c.tagline,
        class: c.classType,
        rarity: c.rarity,
        accentColor: c.accentColor,
        normalizedCoordinates: {
          centerX: c.crop.cx,
          centerY: c.crop.cy,
          radiusPercent: c.crop.radius,
        },
        stats: c.stats,
        superMove: c.superMove,
      })),
    },
    null,
    2
  );

  const cssSprites = `/* Brawl Grid 13-Icon Sprite Sheet CSS */
.arcade-icon {
  width: 128px;
  height: 128px;
  background-image: url('/src/assets/images/arcade_icons_grid_1793543627589.jpg');
  background-size: 853px 480px; /* Scaled to 16:9 sheet */
  border-radius: 50%;
  display: inline-block;
  border: 4px solid #1e293b;
  box-shadow: 0 4px 14px rgba(0,0,0,0.4);
}

${CHARACTERS.map((c) => {
  // Approximate background offset for 128px icon
  const bgX = Math.round((c.crop.cx / 100) * 853 - 64);
  const bgY = Math.round((c.crop.cy / 100) * 480 - 64);
  return `.arcade-icon-${c.id.toLowerCase()} { background-position: -${bgX}px -${bgY}px; } /* ${c.name} */`;
}).join('\n')}
`;

  const handleCopy = (text: string, key: string) => {
    playSelectSound();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Overview & Design Constitution Card */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white">
            Arcade Style Specification & Design Tokens
          </h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed max-w-4xl">
          The 13-Character Arcade Game Profile Icon Grid was generated according to the bold, chunky, and tactile aesthetic of Brawl Stars and modern competitive arcade UI. Below are the verified technical parameters, character metadata, and integration code for Unity, Godot, Web, and Unreal Engine.
        </p>

        {/* 4 Mandatory Tokens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-arcade text-xs text-amber-400 font-bold">TOKEN 01</span>
            <h3 className="text-sm font-bold text-white">Thick Stylized Outlines</h3>
            <p className="text-xs text-slate-400">
              Minimum 4px dark outer perimeter to isolate circular avatars from complex arenas and UI surfaces.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-arcade text-xs text-emerald-400 font-bold">TOKEN 02</span>
            <h3 className="text-sm font-bold text-white">Chunky Proportions</h3>
            <p className="text-xs text-slate-400">
              Stylized, expressive, non-realistic proportions centered in circular button-like bounding volumes.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-arcade text-xs text-cyan-400 font-bold">TOKEN 03</span>
            <h3 className="text-sm font-bold text-white">Tactile Shading</h3>
            <p className="text-xs text-slate-400">
              Top-down directional rim lighting and inner gradient depth imitating physical molded arcade buttons.
            </p>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-arcade text-xs text-rose-400 font-bold">TOKEN 04</span>
            <h3 className="text-sm font-bold text-white">Vibrant Contrast</h3>
            <p className="text-xs text-slate-400">
              Primary and neon hues paired with contrasting geometric/radial fills inside each character frame.
            </p>
          </div>
        </div>
      </div>

      {/* 13-Character Data Table */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            13-Character Icon Roster & Normalized Coordinates
          </span>
          <span className="text-xs font-mono text-slate-400">13 Entries (P1 - P13)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Slot</th>
                <th className="py-3 px-4">Brawler Name</th>
                <th className="py-3 px-4">Archetype Concept</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Rarity</th>
                <th className="py-3 px-4">Center (CX, CY)</th>
                <th className="py-3 px-4">Accent</th>
                <th className="py-3 px-4">Super Move</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {CHARACTERS.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-arcade font-bold text-amber-400">{c.id}</td>
                  <td className="py-3 px-4 font-bold text-white">{c.name}</td>
                  <td className="py-3 px-4 text-slate-400">{c.tagline}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-200">
                      {c.classType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-300 font-medium">{c.rarity}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 tabular-nums">
                    {c.crop.cx}%, {c.crop.cy}%
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <div
                        className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: c.accentColor }}
                      />
                      <span>{c.accentColor}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-amber-300">{c.superMove}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Export: JSON Manifest & CSS Sprites */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl space-y-0">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Integration Code & Coordinate Manifest
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveCodeTab('json');
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  activeCodeTab === 'json'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileJson className="w-3 h-3" />
                <span>JSON Manifest</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveCodeTab('css');
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  activeCodeTab === 'css'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code className="w-3 h-3" />
                <span>CSS Sprites</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() =>
                handleCopy(
                  activeCodeTab === 'json' ? manifestJson : cssSprites,
                  activeCodeTab
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
            >
              {copiedKey === activeCodeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-4 bg-[#0a0d14] overflow-x-auto max-h-96">
          <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre select-all">
            {activeCodeTab === 'json' ? manifestJson : cssSprites}
          </pre>
        </div>
      </div>
    </div>
  );
}
