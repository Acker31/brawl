import { ArenaMatch } from '../types';
import { Flame, Zap } from 'lucide-react';

interface ArenaMatchCardProps {
  match: ArenaMatch;
  busts: Record<string, string>;
  showChoices: boolean;
}

export function ArenaMatchCard({
  match,
  busts,
  showChoices,
}: ArenaMatchCardProps) {
  const isP1Winner = match.status === 'p1_won';
  const isP2Winner = match.status === 'p2_won';
  const isDraw = match.status === 'draw';

  const rpsData: Record<string, { emoji: string; bg: string; border: string; glow: string }> = {
    rock: {
      emoji: '🪨',
      bg: 'from-amber-400 via-orange-500 to-amber-600',
      border: 'border-yellow-200',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.6)]',
    },
    paper: {
      emoji: '📄',
      bg: 'from-cyan-400 via-blue-500 to-indigo-600',
      border: 'border-cyan-200',
      glow: 'shadow-[0_0_12px_rgba(6,182,212,0.6)]',
    },
    scissors: {
      emoji: '✂️',
      bg: 'from-pink-400 via-rose-500 to-red-600',
      border: 'border-pink-200',
      glow: 'shadow-[0_0_12px_rgba(244,63,94,0.6)]',
    },
    hidden: {
      emoji: '❓',
      bg: 'from-slate-700 via-slate-800 to-slate-900',
      border: 'border-slate-600',
      glow: 'shadow-none',
    },
  };

  const p1Choice = rpsData[match.player1.currentChoice || 'rock'] || rpsData.hidden;
  const p2Choice = rpsData[match.player2.currentChoice || 'scissors'] || rpsData.hidden;

  return (
    <div className="relative w-full rounded-2xl border-4 border-black shadow-[0_6px_0_#000] overflow-hidden flex items-stretch p-0 m-0 transition-all duration-200">
      {/* ================= FAR LEFT: FULL-BLEED PLAYER 1 BUST PORTRAIT ================= */}
      <div className="relative self-stretch w-20 sm:w-24 md:w-28 shrink-0 overflow-hidden border-r-4 border-black bg-slate-950 p-0 m-0 flex items-center justify-center group">
        {busts[match.player1.characterIconId] ? (
          <img
            src={busts[match.player1.characterIconId]}
            alt={match.player1.name}
            className="w-full h-full object-cover object-top p-0 m-0 block select-none transition-transform group-hover:scale-105"
          />
        ) : (
          <span className="font-brawl text-amber-400 text-sm font-black">
            {match.player1.characterIconId}
          </span>
        )}

        {/* Character ID Pill Flush in Bottom Corner */}
        <span className="absolute bottom-1 right-1 font-brawl text-[10px] sm:text-xs font-black text-slate-950 bg-yellow-400 px-1.5 py-0.2 rounded border border-black shadow-[0_1px_0_#000] leading-none">
          {match.player1.characterIconId}
        </span>
      </div>

      {/* ================= CENTRAL BLUE ZONE: STATS, NAMES & VS MARKER ================= */}
      <div
        className={`relative z-10 flex-1 min-w-0 flex items-center justify-between gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 overflow-hidden ${
          isP1Winner
            ? 'bg-gradient-to-r from-emerald-500 via-blue-600 to-cyan-500 shadow-[inset_0_2px_10px_rgba(255,255,255,0.4)]'
            : isP2Winner
            ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500 shadow-[inset_0_2px_10px_rgba(255,255,255,0.4)]'
            : isDraw
            ? 'bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 shadow-[inset_0_2px_10px_rgba(255,255,255,0.4)]'
            : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 shadow-[inset_0_2px_10px_rgba(255,255,255,0.35)]'
        }`}
      >
        {/* Background Comic Streaks Overlay in Blue Zone */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 16px, transparent 16px, transparent 32px)',
          }}
        />

        {/* Left Stats Zone (Player 1) */}
        <div className="relative z-10 flex-1 min-w-0 flex items-center justify-between gap-2">
          <div className="min-w-0 space-y-1">
            {/* Player 1 Name */}
            <div className="flex items-center gap-1.5">
              <span className="font-brawl text-sm sm:text-base md:text-lg font-black text-white uppercase tracking-wide truncate brawl-text-shadow">
                {match.player1.name}
              </span>
              {isP1Winner && (
                <span className="shrink-0 font-brawl text-[10px] font-black bg-gradient-to-r from-emerald-400 to-green-500 text-slate-950 px-1.5 py-0.5 rounded border border-black shadow-[0_2px_0_#000] uppercase">
                  WIN
                </span>
              )}
            </div>

            {/* Player 1 Power-up Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Record Pill */}
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#061838] border-2 border-black shadow-[0_2px_0_#000] text-[11px] sm:text-xs font-brawl text-white">
                <span className="text-emerald-400 font-black">W:{match.player1.wins}</span>
                <span className="text-slate-500">·</span>
                <span className="text-rose-400 font-black">L:{match.player1.losses}</span>
                <span className="text-slate-500">·</span>
                <span className="text-amber-300 font-black">D:{match.player1.draws}</span>
              </div>

              {/* Streak Pill */}
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 border-2 border-black shadow-[0_2px_0_#000] text-xs font-brawl font-black text-white"
                title={`Streak: ${match.player1.streak}`}
              >
                <Flame className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300 shrink-0" />
                <span className="brawl-text-shadow">{match.player1.streak}</span>
              </div>

              {/* Bonus Pill */}
              <div
                className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 border-2 border-black shadow-[0_2px_0_#000] text-xs font-brawl font-black text-slate-950"
                title={`Bonus: +${match.player1.streakBonus}%`}
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
                <span>+{match.player1.streakBonus}%</span>
              </div>
            </div>
          </div>

          {/* Player 1 RPS Throw Item */}
          <div className="shrink-0 hidden lg:flex items-center justify-center">
            {showChoices ? (
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr ${p1Choice.bg} border-3 border-black ${p1Choice.border} ${p1Choice.glow} shadow-[0_3px_0_#000] flex items-center justify-center text-xl sm:text-2xl transform hover:scale-110 transition-transform`}
              >
                {p1Choice.emoji}
              </div>
            ) : (
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-800 border-3 border-black shadow-[0_3px_0_#000] flex items-center justify-center font-brawl text-slate-400 text-sm font-black">
                ?
              </div>
            )}
          </div>
        </div>

        {/* ================= DEAD CENTER: GIANT STYLIZED VS BADGE ================= */}
        <div className="relative z-10 shrink-0 px-1 sm:px-2 flex items-center justify-center">
          <div className="relative group">
            {/* Radiant Starburst Aura */}
            <div className="absolute inset-0 bg-yellow-400/40 rounded-full blur-md group-hover:scale-125 transition-transform" />
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-rose-600 via-amber-500 to-yellow-400 border-3 border-black shadow-[0_4px_0_#000] flex items-center justify-center transform -rotate-12 group-hover:rotate-0 transition-transform">
              <span className="font-brawl text-sm sm:text-base md:text-lg font-black text-white tracking-tighter brawl-text-shadow">
                VS
              </span>
            </div>
          </div>
        </div>

        {/* Right Stats Zone (Player 2) */}
        <div className="relative z-10 flex-1 min-w-0 flex items-center justify-between gap-2 text-right">
          {/* Player 2 RPS Throw Item */}
          <div className="shrink-0 hidden lg:flex items-center justify-center">
            {showChoices ? (
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr ${p2Choice.bg} border-3 border-black ${p2Choice.border} ${p2Choice.glow} shadow-[0_3px_0_#000] flex items-center justify-center text-xl sm:text-2xl transform hover:scale-110 transition-transform`}
              >
                {p2Choice.emoji}
              </div>
            ) : (
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-slate-800 border-3 border-black shadow-[0_3px_0_#000] flex items-center justify-center font-brawl text-slate-400 text-sm font-black">
                ?
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            {/* Player 2 Name */}
            <div className="flex items-center justify-end gap-1.5">
              {isP2Winner && (
                <span className="shrink-0 font-brawl text-[10px] font-black bg-gradient-to-r from-emerald-400 to-green-500 text-slate-950 px-1.5 py-0.5 rounded border border-black shadow-[0_2px_0_#000] uppercase">
                  WIN
                </span>
              )}
              <span className="font-brawl text-sm sm:text-base md:text-lg font-black text-white uppercase tracking-wide truncate brawl-text-shadow">
                {match.player2.name}
              </span>
            </div>

            {/* Player 2 Power-up Pills */}
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              {/* Bonus Pill */}
              <div
                className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-300 to-amber-400 border-2 border-black shadow-[0_2px_0_#000] text-xs font-brawl font-black text-slate-950"
                title={`Bonus: +${match.player2.streakBonus}%`}
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
                <span>+{match.player2.streakBonus}%</span>
              </div>

              {/* Streak Pill */}
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 border-2 border-black shadow-[0_2px_0_#000] text-xs font-brawl font-black text-white"
                title={`Streak: ${match.player2.streak}`}
              >
                <Flame className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300 shrink-0" />
                <span className="brawl-text-shadow">{match.player2.streak}</span>
              </div>

              {/* Record Pill */}
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#061838] border-2 border-black shadow-[0_2px_0_#000] text-[11px] sm:text-xs font-brawl text-white">
                <span className="text-emerald-400 font-black">W:{match.player2.wins}</span>
                <span className="text-slate-500">·</span>
                <span className="text-rose-400 font-black">L:{match.player2.losses}</span>
                <span className="text-slate-500">·</span>
                <span className="text-amber-300 font-black">D:{match.player2.draws}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FAR RIGHT: FULL-BLEED PLAYER 2 BUST PORTRAIT ================= */}
      <div className="relative self-stretch w-20 sm:w-24 md:w-28 shrink-0 overflow-hidden border-l-4 border-black bg-slate-950 p-0 m-0 flex items-center justify-center group">
        {busts[match.player2.characterIconId] ? (
          <img
            src={busts[match.player2.characterIconId]}
            alt={match.player2.name}
            className="w-full h-full object-cover object-top p-0 m-0 block select-none transition-transform group-hover:scale-105"
          />
        ) : (
          <span className="font-brawl text-amber-400 text-sm font-black">
            {match.player2.characterIconId}
          </span>
        )}

        {/* Character ID Pill Flush in Bottom Corner */}
        <span className="absolute bottom-1 left-1 font-brawl text-[10px] sm:text-xs font-black text-slate-950 bg-yellow-400 px-1.5 py-0.2 rounded border border-black shadow-[0_1px_0_#000] leading-none">
          {match.player2.characterIconId}
        </span>
      </div>
    </div>
  );
}
