import { useState, useRef, useEffect } from 'react';
import { CharacterIconData, FrameStyle, PlayerProfileSettings } from '../types';
import { sliceCharacterIcon } from '../utils/slicer';
import { GRID_IMAGE_PATH } from '../data/characters';
import { playCharacterSound, playClickSound, playSelectSound, playFanfareSound } from '../utils/soundEffects';
import { Trophy, Volume2, Shield, Zap, Sparkles, Download, Swords, Flame, Award, Heart, Crosshair } from 'lucide-react';

interface BattleCardMakerProps {
  selectedCharacter: CharacterIconData;
  onSelectCharacter: (char: CharacterIconData) => void;
}

export function BattleCardMaker({ selectedCharacter }: BattleCardMakerProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<PlayerProfileSettings>({
    gamerTag: 'STAR_BRAWLER',
    title: 'Arcade Champion',
    trophies: 15420,
    rank: 'Master',
    selectedIconId: selectedCharacter.id,
    frameStyle: 'golden_champion',
    clubName: 'NEON MATRIX',
    winRate: 68.4,
  });

  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Load avatar image when character changes
  useEffect(() => {
    let active = true;
    sliceCharacterIcon(GRID_IMAGE_PATH, selectedCharacter.crop, {
      size: 512,
      isCircular: true,
      includeBorder: false,
    }).then((url) => {
      if (active) setAvatarUrl(url);
    });
    return () => {
      active = false;
    };
  }, [selectedCharacter]);

  const handlePlayVoice = () => {
    playCharacterSound(selectedCharacter.soundType);
  };

  const frameClasses: Record<FrameStyle, { border: string; glow: string; label: string }> = {
    golden_champion: {
      border: 'border-yellow-400 ring-4 ring-amber-400/50',
      glow: 'from-amber-500/20 via-yellow-500/10 to-transparent',
      label: 'Golden Champion',
    },
    classic_arcade: {
      border: 'border-slate-600 ring-4 ring-slate-800/80',
      glow: 'from-slate-700/20 via-slate-800/10 to-transparent',
      label: 'Classic Arcade',
    },
    neon_cyber: {
      border: 'border-cyan-400 ring-4 ring-cyan-500/50',
      glow: 'from-cyan-500/25 via-fuchsia-500/15 to-transparent',
      label: 'Neon Cyberpunk',
    },
    cosmic_void: {
      border: 'border-purple-400 ring-4 ring-indigo-500/50',
      glow: 'from-purple-500/20 via-indigo-500/15 to-transparent',
      label: 'Cosmic Void',
    },
    molten_flame: {
      border: 'border-orange-500 ring-4 ring-red-500/50',
      glow: 'from-orange-500/25 via-rose-500/15 to-transparent',
      label: 'Molten Flame',
    },
    emerald_poison: {
      border: 'border-emerald-400 ring-4 ring-lime-500/50',
      glow: 'from-emerald-500/20 via-lime-500/15 to-transparent',
      label: 'Emerald Poison',
    },
  };

  const rankBadges: Record<PlayerProfileSettings['rank'], { color: string; bg: string }> = {
    Bronze: { color: 'text-amber-700', bg: 'bg-amber-900/40 border-amber-700/50' },
    Silver: { color: 'text-slate-300', bg: 'bg-slate-700/40 border-slate-400/50' },
    Gold: { color: 'text-yellow-400', bg: 'bg-yellow-900/40 border-yellow-500/50' },
    Diamond: { color: 'text-cyan-300', bg: 'bg-cyan-950/60 border-cyan-400/50' },
    Mythic: { color: 'text-purple-300', bg: 'bg-purple-950/60 border-purple-400/50' },
    Legendary: { color: 'text-amber-400', bg: 'bg-amber-950/60 border-amber-400/60' },
    Master: { color: 'text-rose-400', bg: 'bg-rose-950/60 border-rose-500/60' },
  };

  const handleExportCard = () => {
    playFanfareSound();
    setIsExporting(true);

    // Simple canvas snapshot render of card
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 450;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsExporting(false);
      return;
    }

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 800, 450);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 450);

    // Draw card border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 780, 430);

    // Text labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(profile.gamerTag, 320, 90);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(profile.title, 320, 130);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '18px sans-serif';
    ctx.fillText(`Club: [${profile.clubName}]  |  Rank: ${profile.rank}`, 320, 170);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(`🏆 ${profile.trophies.toLocaleString()} Trophies`, 320, 220);

    // Stats
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '18px sans-serif';
    ctx.fillText(`Brawler: ${selectedCharacter.name} (${selectedCharacter.id})`, 320, 280);
    ctx.fillText(`Super: ${selectedCharacter.superMove}`, 320, 320);
    ctx.fillText(`Quote: "${selectedCharacter.voiceLine}"`, 320, 360);

    // Draw circular avatar
    if (avatarUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(160, 225, 120, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 40, 105, 240, 240);
        ctx.restore();

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(160, 225, 120, 0, Math.PI * 2);
        ctx.stroke();

        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = `BattleCard_${profile.gamerTag}_${selectedCharacter.id}.png`;
        a.click();
        setIsExporting(false);
      };
      img.src = avatarUrl;
    } else {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Swords className="w-4 h-4 text-amber-400" />
            <span>Arcade Battle Card & Player Profile Maker</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Showcase your selected 13-grid arcade icon in an authentic Brawl Stars-styled VS player card with customizable badges and stats.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCard}
          disabled={isExporting}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 rounded-xl shadow-md shadow-amber-500/20 border border-yellow-300/40 transition-all cursor-pointer whitespace-nowrap active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Exporting Card...' : 'Export Battle Card (PNG)'}</span>
        </button>
      </div>

      {/* Main Split: Left is Live Battle Card, Right is Customizer Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: The Brawl Stars Profile Battle Card */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div
            ref={cardRef}
            className={`w-full max-w-xl rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#151a26] via-[#10141e] to-[#0c0e15] border-2 border-slate-700/80 shadow-2xl relative overflow-hidden`}
          >
            {/* Thematic Glow Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-tr ${
                frameClasses[profile.frameStyle].glow
              } pointer-events-none`}
            />

            {/* Card Header Strip: Rank, Club, Trophies */}
            <div className="flex items-center justify-between relative z-10 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                    rankBadges[profile.rank].bg
                  } ${rankBadges[profile.rank].color}`}
                >
                  {profile.rank} Tier
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  [{profile.clubName}]
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full shadow-inner">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-arcade text-xs font-black text-amber-300 tabular-nums">
                  {profile.trophies.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Hero Split: Chunky Circular Avatar on Left, Gamertag & Title on Right */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center py-6 relative z-10">
              {/* Circular Avatar Frame */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center">
                <div className="relative group">
                  <div
                    className={`w-36 h-36 rounded-full overflow-hidden border-4 shadow-2xl transition-all duration-300 ${
                      frameClasses[profile.frameStyle].border
                    } bg-[#1b212f]`}
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={selectedCharacter.name}
                        className="w-full h-full object-contain select-none"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 animate-pulse" />
                    )}
                  </div>

                  {/* Character ID Badge below frame */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-arcade text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-300 px-3 py-0.5 rounded-full border border-yellow-200 shadow-md">
                    {selectedCharacter.id}
                  </div>
                </div>

                {/* Voice Line / Audio Play Button */}
                <button
                  type="button"
                  onClick={handlePlayVoice}
                  className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3 h-3 text-amber-400" />
                  <span>Play SFX</span>
                </button>
              </div>

              {/* Player Tag & Character Lore */}
              <div className="sm:col-span-7 space-y-3">
                <div>
                  <h3 className="font-arcade text-2xl font-black text-white tracking-tight break-all">
                    {profile.gamerTag}
                  </h3>
                  <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    {profile.title}
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Chosen Brawler:</span>
                    <span className="font-bold text-white">
                      {selectedCharacter.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Archetype:</span>
                    <span className="text-amber-300 font-semibold">
                      {selectedCharacter.tagline}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Win Rate:</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {profile.winRate}%
                    </span>
                  </div>
                </div>

                {/* Voice line quote */}
                <p className="text-xs italic text-slate-400 border-l-2 border-amber-400/60 pl-2 py-0.5">
                  &ldquo;{selectedCharacter.voiceLine}&rdquo;
                </p>
              </div>
            </div>

            {/* Brawler Combat Stats Bars */}
            <div className="pt-4 border-t border-slate-800/80 relative z-10 space-y-2.5">
              <div className="grid grid-cols-2 gap-3">
                {/* Health */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Heart className="w-3 h-3 text-rose-400" />
                      <span>Health Points</span>
                    </span>
                    <span className="font-mono font-bold text-slate-200">
                      {selectedCharacter.stats.hp}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(selectedCharacter.stats.hp / 7000) * 100}%` }}
                      className="h-full bg-rose-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Attack Damage */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Swords className="w-3 h-3 text-amber-400" />
                      <span>Attack Power</span>
                    </span>
                    <span className="font-mono font-bold text-slate-200">
                      {selectedCharacter.stats.attack}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(selectedCharacter.stats.attack / 6000) * 100}%` }}
                      className="h-full bg-amber-400 rounded-full"
                    />
                  </div>
                </div>

                {/* Speed */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span>Movement Speed</span>
                    </span>
                    <span className="font-mono font-bold text-slate-200">
                      {selectedCharacter.stats.speed}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(selectedCharacter.stats.speed / 1000) * 100}%` }}
                      className="h-full bg-cyan-400 rounded-full"
                    />
                  </div>
                </div>

                {/* Utility */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Crosshair className="w-3 h-3 text-purple-400" />
                      <span>Utility & Crowd Control</span>
                    </span>
                    <span className="font-mono font-bold text-slate-200">
                      {selectedCharacter.stats.utility}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${(selectedCharacter.stats.utility / 700) * 100}%` }}
                      className="h-full bg-purple-400 rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Super Move Banner */}
              <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-amber-300">
                    SUPER: {selectedCharacter.superMove}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  {selectedCharacter.superDescription.slice(0, 50)}...
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Customization Controls */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Profile Customization
            </h4>

            {/* Gamertag Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Player Gamertag:</label>
              <input
                type="text"
                value={profile.gamerTag}
                maxLength={18}
                onChange={(e) => setProfile((p) => ({ ...p, gamerTag: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm font-semibold text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Title Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Player Title:</label>
              <select
                value={profile.title}
                onChange={(e) => setProfile((p) => ({ ...p, title: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="Arcade Champion">Arcade Champion</option>
                <option value="The Undefeated">The Undefeated</option>
                <option value="Grid Master">Grid Master</option>
                <option value="Neon Overlord">Neon Overlord</option>
                <option value="Cosmic Legend">Cosmic Legend</option>
                <option value="Street Brawler">Street Brawler</option>
                <option value="Brawl Maestro">Brawl Maestro</option>
              </select>
            </div>

            {/* Rank Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Competitive Rank:</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Bronze', 'Silver', 'Gold', 'Diamond', 'Mythic', 'Legendary', 'Master'] as const).map(
                  (r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setProfile((p) => ({ ...p, rank: r }));
                      }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        profile.rank === r
                          ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Frame Style Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Icon Frame Aura:</label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    'golden_champion',
                    'neon_cyber',
                    'classic_arcade',
                    'cosmic_void',
                    'molten_flame',
                    'emerald_poison',
                  ] as FrameStyle[]
                ).map((fs) => (
                  <button
                    key={fs}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setProfile((p) => ({ ...p, frameStyle: fs }));
                    }}
                    className={`py-2 px-2.5 text-left rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      profile.frameStyle === fs
                        ? 'bg-slate-800 text-amber-300 border-amber-400 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {frameClasses[fs].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trophies Counter */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Trophies:</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={profile.trophies}
                  min={0}
                  max={99999}
                  step={50}
                  onChange={(e) => setProfile((p) => ({ ...p, trophies: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm font-mono text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setProfile((p) => ({ ...p, trophies: p.trophies + 100 }));
                  }}
                  className="px-3 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  +100 🏆
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
