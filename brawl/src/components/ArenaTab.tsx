import { useState } from 'react';
import { INITIAL_ARENA_MATCHES } from '../data/arenaData';
import { ArenaMatch, RPSChoice } from '../types';
import { ArenaMatchCard } from './ArenaMatchCard';
import { useBustPortraits } from '../utils/useCharacterAvatars';
import {
  playClickSound,
  playSelectSound,
  playFanfareSound,
  playShuffleSwoosh,
  playSlamImpact,
} from '../utils/soundEffects';
import {
  Tv,
  Maximize2,
  Eye,
  EyeOff,
  Flame,
  Swords,
  Shuffle,
  Zap,
  Trophy,
  Clock,
} from 'lucide-react';
import { useRef } from 'react';

export function ArenaTab() {
  const [matches, setMatches] = useState<ArenaMatch[]>(INITIAL_ARENA_MATCHES);
  const [showChoices, setShowChoices] = useState<boolean>(true);
  const [isTvAspectLocked, setIsTvAspectLocked] = useState<boolean>(false);
  const [roundCounter, setRoundCounter] = useState<number>(4);
  const [recapRound, setRecapRound] = useState<number>(3);
  const [shufflePhase, setShufflePhase] = useState<'idle' | 'exit' | 'intermission' | 'enter'>('idle');
  const [showScreenFlash, setShowScreenFlash] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(4);
  const [recentWinners, setRecentWinners] = useState<ArenaMatch['player1'][]>([
    INITIAL_ARENA_MATCHES[1].player1,
    INITIAL_ARENA_MATCHES[0].player1,
    INITIAL_ARENA_MATCHES[3].player1,
    INITIAL_ARENA_MATCHES[4].player2,
  ]);
  const busts = useBustPortraits();
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Left Column (Matches 1, 2, 3)
  const leftMatches = matches.slice(0, 3);
  // Right Column (Matches 4, 5, 6, 7)
  const rightMatches = matches.slice(3, 7);

  // High-streak leader calculation
  const allPlayers = matches.flatMap((m) => [m.player1, m.player2]);
  const streakLeader = [...allPlayers].sort((a, b) => b.streak - a.streak)[0];

  const rpsOptions: RPSChoice[] = ['rock', 'paper', 'scissors'];

  const evaluateRPS = (c1: RPSChoice, c2: RPSChoice): 'p1_won' | 'p2_won' | 'draw' => {
    if (c1 === c2) return 'draw';
    if (
      (c1 === 'rock' && c2 === 'scissors') ||
      (c1 === 'scissors' && c2 === 'paper') ||
      (c1 === 'paper' && c2 === 'rock')
    ) {
      return 'p1_won';
    }
    return 'p2_won';
  };

  const executeEnterPhase = () => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);

    setShufflePhase('enter');
    setShowScreenFlash(false);
    playSlamImpact();

    // Settle back to idle after cards finish slamming
    setTimeout(() => {
      setShufflePhase('idle');
    }, 460);
  };

  // The Dramatic Card Swipe & 4-Second Winner Recap Board Sequence
  const handleDramaticShuffle = () => {
    if (shufflePhase !== 'idle') return;

    // Capture winners from the current round BEFORE re-pairing
    const decisiveWinners = matches
      .filter((m) => m.status === 'p1_won' || m.status === 'p2_won')
      .map((m) => (m.status === 'p1_won' ? m.player1 : m.player2));

    // If fewer than 4 decisive winners (e.g. ties), backfill from highest streakers
    let winnersList = [...decisiveWinners];
    if (winnersList.length < 4) {
      const all = matches.flatMap((m) => [m.player1, m.player2]);
      const sortedByStreak = [...all].sort((a, b) => b.streak - a.streak);
      for (const p of sortedByStreak) {
        if (!winnersList.some((w) => w.id === p.id) && winnersList.length < 6) {
          winnersList.push(p);
        }
      }
    }
    setRecentWinners(winnersList);
    setRecapRound(roundCounter);
    setCountdown(4);

    // Phase 1: The Exit Phase (Swoosh Out)
    setShufflePhase('exit');
    setShowScreenFlash(true);
    playShuffleSwoosh();

    // Phase 2: The 4-Second Winner Recap Board (after exit swoosh ~320ms)
    setTimeout(() => {
      setShufflePhase('intermission');
      playFanfareSound();

      // Re-assign all 14 players into fresh random pairings
      const allCurrentPlayers = matches.flatMap((m) => [m.player1, m.player2]);
      const shuffled = [...allCurrentPlayers].sort(() => Math.random() - 0.5);

      const nextRound = roundCounter + 1;
      setRoundCounter(nextRound);

      const newPairings: ArenaMatch[] = [];
      for (let i = 0; i < 7; i++) {
        const p1 = shuffled[i * 2];
        const p2 = shuffled[i * 2 + 1];
        const choice1 = rpsOptions[Math.floor(Math.random() * rpsOptions.length)];
        const choice2 = rpsOptions[Math.floor(Math.random() * rpsOptions.length)];
        const result = evaluateRPS(choice1, choice2);

        newPairings.push({
          id: i + 1,
          matchNumber: i + 1,
          title: `MATCH ${i + 1}`,
          status: result,
          round: nextRound,
          player1: {
            ...p1,
            currentChoice: choice1,
          },
          player2: {
            ...p2,
            currentChoice: choice2,
          },
        });
      }
      setMatches(newPairings);

      // Countdown ticker: 4 -> 3 -> 2 -> 1
      let remainingSec = 4;
      intervalTimerRef.current = setInterval(() => {
        remainingSec -= 1;
        setCountdown((prev) => Math.max(1, prev - 1));
        if (remainingSec <= 1 && intervalTimerRef.current) {
          clearInterval(intervalTimerRef.current);
        }
      }, 1000);

      // Mandatory 4-Second Hold: Lock on screen for 4 full seconds
      holdTimerRef.current = setTimeout(() => {
        executeEnterPhase();
      }, 4000);
    }, 320);
  };

  // Next round simulation without full shuffle
  const handleSimulateNextRound = () => {
    if (shufflePhase !== 'idle') return;
    playSelectSound();
    playFanfareSound();
    const nextRound = roundCounter + 1;
    setRoundCounter(nextRound);

    setMatches((prevMatches) =>
      prevMatches.map((m) => {
        const choice1 = rpsOptions[Math.floor(Math.random() * rpsOptions.length)];
        const choice2 = rpsOptions[Math.floor(Math.random() * rpsOptions.length)];
        const result = evaluateRPS(choice1, choice2);

        let p1Wins = m.player1.wins;
        let p1Losses = m.player1.losses;
        let p1Draws = m.player1.draws;
        let p1Streak = m.player1.streak;

        let p2Wins = m.player2.wins;
        let p2Losses = m.player2.losses;
        let p2Draws = m.player2.draws;
        let p2Streak = m.player2.streak;

        if (result === 'p1_won') {
          p1Wins += 1;
          p1Streak += 1;
          p2Losses += 1;
          p2Streak = 0;
        } else if (result === 'p2_won') {
          p2Wins += 1;
          p2Streak += 1;
          p1Losses += 1;
          p1Streak = 0;
        } else {
          p1Draws += 1;
          p2Draws += 1;
        }

        const p1Bonus = Math.min(60, 10 + p1Streak * 5);
        const p2Bonus = Math.min(60, 10 + p2Streak * 5);

        return {
          ...m,
          status: result,
          round: nextRound,
          player1: {
            ...m.player1,
            wins: p1Wins,
            losses: p1Losses,
            draws: p1Draws,
            streak: p1Streak,
            streakBonus: p1Bonus,
            currentChoice: choice1,
          },
          player2: {
            ...m.player2,
            wins: p2Wins,
            losses: p2Losses,
            draws: p2Draws,
            streak: p2Streak,
            streakBonus: p2Bonus,
            currentChoice: choice2,
          },
        };
      })
    );
  };

  const handleToggleFullscreen = () => {
    playClickSound();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* High-Energy Brawl Stars Tournament Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-[#172054] via-[#1f1b58] to-[#172054] p-3 rounded-2xl border-4 border-yellow-400 shadow-[0_6px_0_#000]">
        {/* Brand / Mode Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-600 border-3 border-black shadow-[0_3px_0_#000] flex items-center justify-center transform -rotate-3">
            <Swords className="w-5 h-5 text-slate-950" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="font-brawl text-xl sm:text-2xl font-black text-white tracking-wide uppercase brawl-text-shadow">
              BRAWL BATTLE ARENA
            </h1>
            <span className="font-brawl text-xs font-black text-slate-950 bg-gradient-to-r from-yellow-300 to-amber-400 px-2 py-0.5 rounded-lg border-2 border-black shadow-[0_2px_0_#000] uppercase">
              ROUND {roundCounter}
            </span>
          </div>
        </div>

        {/* Comic Streak Leader Banner */}
        <div className="hidden md:flex items-center gap-2 bg-[#0d122e] px-3.5 py-1.5 rounded-full border-2 border-black shadow-[0_3px_0_#000]">
          <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-bounce" />
          <span className="font-brawl text-xs text-amber-300 uppercase tracking-wider">
            STREAK MVP:
          </span>
          <span className="font-brawl text-xs text-white uppercase brawl-text-shadow">
            {streakLeader?.name}
          </span>
          <span className="font-brawl text-xs text-slate-950 bg-amber-400 px-1.5 py-0.2 rounded border border-black font-black">
            🔥 {streakLeader?.streak}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Conceal/Reveal Toggle */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setShowChoices(!showChoices);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 font-brawl text-xs font-black uppercase text-white bg-[#1a2350] hover:bg-[#253272] rounded-xl border-3 border-black shadow-[0_3px_0_#000] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            {showChoices ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {showChoices ? 'HIDE HANDS' : 'REVEAL HANDS'}
            </span>
          </button>

          {/* SHUFFLE BUTTON (Placed right next to Reveal Hands) */}
          <button
            type="button"
            onClick={handleDramaticShuffle}
            disabled={shufflePhase !== 'idle'}
            className="flex items-center gap-1.5 px-3 py-1.5 font-brawl text-xs font-black uppercase text-slate-950 bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 hover:from-cyan-200 hover:to-sky-300 disabled:opacity-50 rounded-xl border-3 border-black shadow-[0_3px_0_#000] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            title="Dramatic Shuffle: Re-pair All Students"
          >
            <Shuffle className="w-3.5 h-3.5 shrink-0 animate-spin-once" />
            <span>SHUFFLE</span>
          </button>

          {/* 16:9 Bezel Toggle */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setIsTvAspectLocked(!isTvAspectLocked);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-brawl text-xs font-black uppercase rounded-xl border-3 border-black shadow-[0_3px_0_#000] active:translate-y-1 active:shadow-none transition-all cursor-pointer ${
              isTvAspectLocked
                ? 'bg-cyan-400 text-slate-950'
                : 'bg-[#1a2350] hover:bg-[#253272] text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">16:9 TV</span>
          </button>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-2 bg-[#1a2350] hover:bg-[#253272] text-white rounded-xl border-3 border-black shadow-[0_3px_0_#000] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            title="Fullscreen Mode"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Big Chunky Brawl Stars Style Simulation Button */}
          <button
            type="button"
            onClick={handleSimulateNextRound}
            disabled={shufflePhase !== 'idle'}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 font-brawl text-xs sm:text-sm font-black uppercase text-slate-950 bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 hover:from-yellow-200 hover:to-amber-400 disabled:opacity-50 rounded-xl border-3 border-black shadow-[0_5px_0_#000] active:translate-y-1 active:shadow-[0_1px_0_#000] transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span className="tracking-wide">BRAWL ROUND {roundCounter + 1}!</span>
          </button>
        </div>
      </div>

      {/* Edge-to-Edge 2-Column Tournament Board */}
      <div
        className={`w-full relative overflow-hidden transition-all duration-200 ${
          isTvAspectLocked
            ? 'aspect-[16/9] overflow-y-auto brawl-bg-pattern rounded-3xl border-6 border-black p-3 sm:p-4 shadow-2xl ring-4 ring-yellow-400/50'
            : 'brawl-bg-pattern p-2 sm:p-3 rounded-2xl border-4 border-black'
        }`}
      >
        {/* Electric Blue Screen Flash Ripple Effect during Exit */}
        {showScreenFlash && (
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-blue-500/50 to-cyan-300/30 pointer-events-none anim-screen-flash z-30" />
        )}

        {/* Phase 2: Split-Screen 4-Second Winner Recap Board */}
        {shufflePhase === 'intermission' && (
          <div className="absolute inset-0 z-40 flex items-center justify-center w-full h-full bg-[#090c21]/95 backdrop-blur-md overflow-hidden p-3 sm:p-5">
            <div className="w-full h-full max-w-7xl mx-auto flex items-center justify-center overflow-hidden">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-center anim-banner-pop overflow-hidden">
                {/* ================= LEFT SIDE: THE ANNOUNCEMENT ================= */}
                <div className="w-full flex flex-col justify-between items-center text-center p-5 sm:p-6 bg-gradient-to-b from-[#182357] via-[#12193f] to-[#0c102a] rounded-3xl border-4 border-black shadow-[0_8px_0_#000] relative overflow-hidden">
                  {/* Glowing Aura */}
                  <div className="absolute -inset-10 bg-gradient-to-tr from-amber-500/25 via-yellow-400/20 to-cyan-500/25 blur-3xl pointer-events-none" />

                  {/* Top Round Pill */}
                  <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d1330] border-2 border-black shadow-[0_2px_0_#000] mb-3">
                    <Zap className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-brawl text-xs font-black text-amber-300 uppercase tracking-widest">
                      ROUND {recapRound} FINISHED
                    </span>
                  </div>

                  {/* Yellow/Orange Comic Announcement Banner: GET READY! */}
                  <div className="relative z-10 w-full px-5 py-5 sm:py-6 bg-gradient-to-b from-yellow-300 via-amber-400 to-orange-500 border-5 border-black rounded-3xl shadow-[0_8px_0_#000] transform -rotate-1 my-auto">
                    <h2
                      className="font-brawl text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-[0.08em] leading-tight [text-shadow:_2px_2px_0_#000] drop-shadow-[0_3px_0_rgba(0,0,0,0.4)] whitespace-nowrap"
                      style={{ letterSpacing: '0.08em' }}
                    >
                      GET READY!
                    </h2>
                    <div className="mt-2.5 flex items-center justify-center gap-2">
                      <Swords className="w-4 h-4 text-white drop-shadow" />
                      <span className="font-brawl text-xs sm:text-sm font-black text-white uppercase tracking-wider drop-shadow-md">
                        ROUND {roundCounter} · NEW PAIRINGS
                      </span>
                      <Swords className="w-4 h-4 text-white drop-shadow" />
                    </div>
                  </div>

                  {/* 4-Second Hold Timer and Classroom Countdown Bar */}
                  <div className="relative z-10 w-full max-w-sm mt-4 bg-slate-950/85 border-3 border-black rounded-2xl p-3 shadow-[0_4px_0_#000]">
                    <div className="flex items-center justify-between text-xs font-brawl font-black uppercase text-amber-300 mb-2 px-1">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 animate-spin-once" />
                        <span>ARENA SLAM IN</span>
                      </span>
                      <span className="text-slate-950 text-xs font-black bg-gradient-to-r from-amber-300 to-yellow-400 px-2.5 py-0.5 rounded-lg border border-black shadow-[0_1px_0_#000]">
                        {countdown} SECONDS
                      </span>
                    </div>
                    {/* Animated Progress Bar */}
                    <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden border-2 border-black p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 rounded-full transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                        style={{ width: `${(countdown / 4) * 100}%` }}
                      />
                    </div>
                    {/* Skip to battle now shortcut */}
                    <button
                      type="button"
                      onClick={executeEnterPhase}
                      className="mt-2 text-[10px] font-brawl uppercase text-amber-300/80 hover:text-amber-200 underline cursor-pointer"
                    >
                      Skip Wait & Slam Cards Now ➔
                    </button>
                  </div>
                </div>

                {/* ================= RIGHT SIDE: THE WINNERS HALL OF FAME (RED HIGHLIGHTED AREA) ================= */}
                <div className="w-full flex flex-col bg-gradient-to-b from-[#2b0c16]/95 via-[#1a0812]/95 to-[#12040b]/95 border-4 border-rose-600 rounded-3xl p-5 shadow-[0_0_35px_rgba(225,29,72,0.45),0_8px_0_#000] ring-2 ring-red-400/40 relative overflow-hidden">
                  {/* Red Ambient Glow */}
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-600/30 rounded-full blur-3xl pointer-events-none" />

                  {/* Red Highlighted Title Header: MATCH WINNERS */}
                  <div className="relative z-10 flex items-center justify-between gap-3 mb-3.5 pb-2.5 border-b-3 border-rose-900/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 border-3 border-black shadow-[0_3px_0_#000] flex items-center justify-center transform -rotate-3">
                        <Trophy className="w-5 h-5 text-yellow-200 fill-yellow-200" />
                      </div>
                      <div>
                        <h3 className="font-brawl text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-wide brawl-text-shadow flex items-center gap-2">
                          <span>MATCH WINNERS</span>
                        </h3>
                        <p className="font-brawl text-[10px] sm:text-xs font-bold text-rose-300 uppercase tracking-widest">
                          ROUND {recapRound} VICTORS · HALL OF FAME
                        </p>
                      </div>
                    </div>

                    {/* Victors Badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 border-2 border-black shadow-[0_2px_0_#000]">
                      <Flame className="w-4 h-4 fill-amber-300 text-amber-300 animate-pulse" />
                      <span className="font-brawl text-xs font-black text-white uppercase">
                        {recentWinners.length} VICTORS
                      </span>
                    </div>
                  </div>

                  {/* Dedicated Grid: Compact High-Impact Winner Cards */}
                  {/* Rule: Shows ONLY profile avatar image + current streak counter with glowing orange/yellow flame badge */}
                  {/* Rule: Chunky black borders + electric blue backgrounds */}
                  <div className="relative z-10 grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3 flex-1 items-center content-center py-1">
                    {recentWinners.map((winner) => (
                      <div
                        key={winner.id}
                        className="group relative aspect-square rounded-2xl border-4 border-black shadow-[0_5px_0_#000] bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 overflow-hidden flex items-center justify-center transform hover:scale-105 transition-transform duration-200"
                      >
                        {/* Top gloss rim highlight */}
                        <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-white/35 to-transparent pointer-events-none z-10" />

                        {/* Avatar Profile Bust Image */}
                        {busts[winner.characterIconId] ? (
                          <img
                            src={busts[winner.characterIconId]}
                            alt={winner.name}
                            className="w-full h-full object-cover object-top block p-0 m-0 select-none"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-brawl text-xl font-black text-white">
                            {winner.characterIconId}
                          </div>
                        )}

                        {/* Glowing Orange/Yellow Flame Streak Badge */}
                        <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 border-2 border-black shadow-[0_2px_0_#000] ring-2 ring-yellow-300/80 whitespace-nowrap">
                          <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-200 text-slate-950 animate-bounce" />
                          <span className="font-brawl text-xs sm:text-sm font-black text-slate-950 tracking-wider">
                            {winner.streak > 0 ? winner.streak : 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2-Column Grid with Staggered Entrance and Swoosh-Out Animations */}
        <div
          className={`grid grid-cols-1 xl:grid-cols-2 gap-2.5 sm:gap-3 items-start w-full ${
            shufflePhase === 'intermission' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {/* LEFT COLUMN: 3 Battles (Matches 1, 2, 3) */}
          <div className="space-y-2.5 sm:space-y-3">
            {leftMatches.map((match, idx) => {
              const animClass =
                shufflePhase === 'exit'
                  ? 'anim-swoosh-left'
                  : shufflePhase === 'enter'
                  ? 'anim-slam-left'
                  : '';
              const animDelay =
                shufflePhase === 'exit'
                  ? `${idx * 40}ms`
                  : shufflePhase === 'enter'
                  ? `${idx * 60}ms`
                  : '0ms';

              return (
                <div
                  key={`${match.id}-${match.player1.id}-${match.player2.id}`}
                  style={{ animationDelay: animDelay }}
                  className={animClass}
                >
                  <ArenaMatchCard
                    match={match}
                    busts={busts}
                    showChoices={showChoices}
                  />
                </div>
              );
            })}
          </div>

          {/* RIGHT COLUMN: 4 Battles (Matches 4, 5, 6, 7) */}
          <div className="space-y-2.5 sm:space-y-3">
            {rightMatches.map((match, idx) => {
              const animClass =
                shufflePhase === 'exit'
                  ? 'anim-swoosh-right'
                  : shufflePhase === 'enter'
                  ? 'anim-slam-right'
                  : '';
              const animDelay =
                shufflePhase === 'exit'
                  ? `${idx * 40}ms`
                  : shufflePhase === 'enter'
                  ? `${idx * 60}ms`
                  : '0ms';

              return (
                <div
                  key={`${match.id}-${match.player1.id}-${match.player2.id}`}
                  style={{ animationDelay: animDelay }}
                  className={animClass}
                >
                  <ArenaMatchCard
                    match={match}
                    busts={busts}
                    showChoices={showChoices}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
