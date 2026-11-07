export type CharacterClass = 
  | 'Tank' 
  | 'Assassin' 
  | 'Mage' 
  | 'Support' 
  | 'Artillery' 
  | 'Brawler' 
  | 'Controller';

export interface SlicingCoord {
  // Percentages 0..100
  cx: number; // center X %
  cy: number; // center Y %
  radius: number; // radius %
}

export interface CharacterIconData {
  id: string; // "P1" to "P13"
  index: number; // 1 to 13
  name: string;
  tagline: string;
  role: string;
  classType: CharacterClass;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Mythic' | 'Legendary' | 'Championship';
  theme: string;
  description: string;
  accentColor: string;
  badgeBg: string;
  superMove: string;
  superDescription: string;
  voiceLine: string;
  soundType: 'mech' | 'ninja' | 'magic' | 'knight' | 'alien' | 'plant' | 'skater' | 'ghost' | 'hero' | 'builder' | 'pirate' | 'dragon' | 'thief';
  stats: {
    hp: number;
    attack: number;
    speed: number;
    utility: number;
  };
  crop: SlicingCoord;
}

export type FrameStyle = 'classic_arcade' | 'neon_cyber' | 'golden_champion' | 'cosmic_void' | 'molten_flame' | 'emerald_poison';

export interface PlayerProfileSettings {
  gamerTag: string;
  title: string;
  trophies: number;
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Mythic' | 'Legendary' | 'Master';
  selectedIconId: string;
  frameStyle: FrameStyle;
  clubName: string;
  winRate: number;
}

export type RPSChoice = 'rock' | 'paper' | 'scissors' | 'hidden';

export interface ArenaBadge {
  icon: string;
  label: string;
  color: string;
}

export interface ArenaPlayer {
  id: string;
  name: string;
  characterIconId: string; // P1 to P13
  wins: number;
  losses: number;
  draws: number;
  streak: number;
  streakBonus: number; // percentage, e.g. 20 for +20%
  badges: string[]; // badge icons / labels
  currentChoice?: RPSChoice;
  colorTheme: 'blue' | 'rose' | 'amber' | 'emerald' | 'purple' | 'cyan' | 'orange';
}

export interface ArenaMatch {
  id: number;
  matchNumber: number; // 1 to 7
  title: string;
  player1: ArenaPlayer;
  player2: ArenaPlayer;
  status: 'active' | 'p1_won' | 'p2_won' | 'draw';
  round: number;
}
