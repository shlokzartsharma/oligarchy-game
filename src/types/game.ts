export type Difficulty = 'easy' | 'medium' | 'hard';
export type AgeTrack = 'student' | 'adult';
export type Gender = 'male' | 'female' | 'non-binary';
export type MarketCycle = 'bull' | 'recession' | 'bear' | 'normal';
export type AssetClass = 'stocks' | 'bonds' | 'realEstate' | 'gold' | 'crypto';

export interface PlayerProfile {
  name: string;
  age: number;
  gender: Gender;
  avatar: string;
  profession?: string;
  difficulty: Difficulty;
  ageTrack: AgeTrack;
  netWorth: number;
  happiness: number;
  health: number;
  creditScore: number;
  year: number;
  currentYear: number;
}

export interface Account {
  type: 'checking' | 'savings' | 'credit' | 'brokerage' | 'ira' | 'roth' | '401k' | 'hys';
  balance: number;
  interestRate?: number;
  creditLimit?: number;
  unlocked: boolean;
}

export interface Investment {
  assetClass: AssetClass;
  amount: number;
  allocation: number; // percentage
}

export interface YearEvent {
  age: number;
  title: string;
  description: string;
  choiceA: {
    text: string;
    consequences: EventConsequences;
  };
  choiceB: {
    text: string;
    consequences: EventConsequences;
  };
  required?: boolean;
}

export interface EventConsequences {
  wealth?: number; // change in wealth
  happiness?: number; // change in happiness
  creditScore?: number; // change in credit score
  unlocks?: string[]; // account types to unlock
  flags?: string[]; // flags to set (e.g., 'divorce_risk', 'panic_sold')
  message?: string;
}

export interface MarketCycleData {
  year: number;
  type: MarketCycle;
  returns: {
    stocks: { min: number; max: number };
    bonds: { min: number; max: number };
    realEstate: { min: number; max: number };
    gold: { min: number; max: number };
    crypto: { min: number; max: number };
  };
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  unlocks: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface GameState {
  profile: PlayerProfile;
  accounts: Account[];
  investments: Investment[];
  marketCycle: MarketCycleData;
  events: YearEvent[];
  completedQuizzes: string[];
  flags: string[];
  unlockedCosmetics: string[];
}

export interface Profession {
  name: string;
  salary: number;
  description: string;
}

