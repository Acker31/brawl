import { ArenaPlayer } from '../types';
import { Flame, Zap } from 'lucide-react';

interface ArenaPlayerCardProps {
  player: ArenaPlayer;
  avatarUrl?: string;
  isWinner?: boolean;
  isLoser?: boolean;
  isDraw?: boolean;
  side: 'left' | 'right';
  onResult: (outcome: 'win' | 'draw' | 'loss') => void;
}

export function ArenaPlayerCard({
  player,
  avatarUrl,
  isWinner,
  isLoser,
  isDraw,
  side,
  onResult,
}: ArenaPlayerCardProps) {
  const glowColors: Record<string, { ring: string; shadow: string }> = {
    orange: {
      ring: 'border-orange-500 ring-2 ring-orange-400',
      shadow: 'shadow-[0_0_12px_rgba(249,115,22,0.4)]',
    },
    cyan: {
      ring: 'border-cyan-400 ring-2 ring-cyan-300',
      shadow: 'shadow-[0_0_12px_rgba(6,182,212,0.4)]',
    },
    blue: {
      ring: 'border-blue-500 ring-2 ring-blue-400',
      shadow: 'shadow-[0_0_12px_rgba(59,130,246,0.4)]',
    },
    amber: {
      ring: 'border-amber-400 ring-2 ring-yellow-300',
      shadow: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    },
    emerald: {
      ring: 'border-emerald-400 ring-2 ring-teal-300',
      shadow: 'shadow-[0_0_12px_rgba(16,185,129,0.4)]',
    },
    rose: {
      ring: 'border-rose-500 ring-2 ring-pink-400',
      shadow: 'shadow-[0_0_12px_rgba(244,63,94,0.4)]',
    },
    purple: {
      ring: 'border-purple-500 ring-2 ring-fuchsia-400',
      shadow: 'shadow-[0_0_12px_rgba(168,85,247,0.4)]',
    },
  };

  const theme = glowColors[player.colorTheme] || glowColors.orange;

  return (
    <div
      className={`relative flex items-center gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl transition-all duration-150 border-3 border-slate-900 shadow-[0_3px_0_#090d14] ${
        isWinner
          ? 'bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-950 ring-2 ring-emerald-400/70'
          : isLoser
          ? 'bg-slate-950/70 opacity-75'
          : 'bg-[#141824]'
      } ${side === 'right' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}
    >
      {/* 1. Circular Avatar Image with thick 4px dark border and neon gradient glow */}
      <div className="relative shrink-0">
        <div
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-3 border-slate-950 ${theme.ring} ${theme.shadow} bg-slate-900 flex items-center justify-center`}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={player.name}
              className="w-full h-full object-contain select-none"
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center font-arcade font-bold text-amber-400 text-xs">
              {player.characterIconId}
            </div>
          )}
        </div>

        {/* Character ID Mini Badge */}
        <span
          className={`absolute -bottom-1 ${
            side === 'right' ? 'left-0' : 'right-0'
          } font-arcade text-[9px] font-black text-slate-950 bg-amber-400 px-1 py-0 rounded border border-slate-900 leading-none shadow`}
        >
          {player.characterIconId}
        </span>
      </div>

      {/* Main Info Block */}
      <div className="flex-1 min-w-0 space-y-0.5">
        {/* Name + Win Pill */}
        <div className={`flex items-center gap-1.5 ${side === 'right' ? 'justify-end' : 'justify-start'}`}>
          <span className="font-arcade text-xs sm:text-sm font-black text-white tracking-tight truncate leading-none">
            {player.name}
          </span>
          {isWinner && (
            <span className="shrink-0 bg-emerald-500 text-slate-950 font-black font-arcade text-[9px] px-1 py-0.2 rounded border border-emerald-300 leading-none">
              WIN
            </span>
          )}
        </div>

        {/* Record (W / L / D) */}
        <div
          className={`flex items-center gap-1 text-[11px] font-mono font-bold tracking-tight leading-none ${
            side === 'right' ? 'justify-end' : 'justify-start'
          }`}
        >
          <span className="text-emerald-400 font-extrabold">W:{player.wins}</span>
          <span className="text-slate-600">|</span>
          <span className="text-rose-400 font-extrabold">L:{player.losses}</span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-400 font-extrabold">D:{player.draws}</span>
        </div>

        {/* Streak, Bonus & Badges Row (Clean, minimal text) */}
        <div
          className={`flex items-center gap-1.5 pt-0.5 ${
            side === 'right' ? 'justify-end' : 'justify-start'
          }`}
        >
          {/* Streak: Just Fire Icon and Number */}
          <div
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-orange-950/90 border border-orange-500 text-orange-300 text-[11px] font-arcade font-black leading-none"
            title={`Streak: ${player.streak}`}
          >
            <Flame className="w-3 h-3 text-orange-400 fill-orange-400 shrink-0" />
            <span>{player.streak}</span>
          </div>

          {/* Bonus: Just Icon and Number */}
          <div
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-yellow-400 text-slate-950 text-[11px] font-black border border-yellow-200 leading-none"
            title={`Bonus: +${player.streakBonus}%`}
          >
            <Zap className="w-3 h-3 fill-slate-950 shrink-0" />
            <span>{player.streakBonus}%</span>
          </div>

          {/* Badges: Minimal icon row */}
          <div className="flex items-center gap-0.5 text-[11px] leading-none">
            {player.badges.map((b, i) => (
              <span key={i} className="opacity-90">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Replaced RPS Icon with Tactile Win / Draw / Loss Button Controller */}
      <div className="shrink-0 flex items-center gap-1">
        <button
          type="button"
          onClick={() => onResult('win')}
          title="Record Win (+1 Win, +1 Streak)"
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-arcade font-black text-xs border-2 transition-all cursor-pointer flex items-center justify-center active:scale-90 shadow-sm ${
            isWinner
              ? 'bg-emerald-500 text-slate-950 border-emerald-300 ring-2 ring-emerald-400/80 scale-105 shadow-md shadow-emerald-500/30'
              : 'bg-emerald-950/70 text-emerald-400 border-emerald-800 hover:bg-emerald-600 hover:text-white'
          }`}
        >
          W
        </button>
        <button
          type="button"
          onClick={() => onResult('draw')}
          title="Record Draw (+1 Draw)"
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-arcade font-black text-xs border-2 transition-all cursor-pointer flex items-center justify-center active:scale-90 shadow-sm ${
            isDraw
              ? 'bg-amber-400 text-slate-950 border-amber-200 ring-2 ring-amber-400/80 scale-105 shadow-md shadow-amber-500/30'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
          }`}
        >
          D
        </button>
        <button
          type="button"
          onClick={() => onResult('loss')}
          title="Record Loss (+1 Loss, Reset Streak)"
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-arcade font-black text-xs border-2 transition-all cursor-pointer flex items-center justify-center active:scale-90 shadow-sm ${
            isLoser
              ? 'bg-rose-500 text-slate-950 border-rose-300 ring-2 ring-rose-400/80 scale-105 shadow-md shadow-rose-500/30'
              : 'bg-rose-950/70 text-rose-400 border-rose-800 hover:bg-rose-600 hover:text-white'
          }`}
        >
          L
        </button>
      </div>
    </div>
  );
}
