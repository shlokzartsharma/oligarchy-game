import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, PlayerProfile, Account, Investment, MarketCycleData, Difficulty, AgeTrack, YearEvent } from '../types/game';
import { getMarketCycle, getRandomReturn } from '../data/marketCycles';
import { getEventsForAge } from '../data/events';
import { professions } from '../data/professions';

interface GameStore extends GameState {
  // Actions
  initializeGame: (profile: Partial<PlayerProfile>) => void;
  advanceYear: () => void;
  makeChoice: (choiceIndex: 0 | 1, event: YearEvent) => void;
  completeQuiz: (quizId: string) => void;
  updateAccount: (accountType: Account['type'], amount: number) => void;
  unlockAccount: (accountType: Account['type']) => void;
  addInvestment: (assetClass: string, amount: number) => void;
  calculateNetWorth: () => number;
  resetGame: () => void;
}

const initialAccounts: Account[] = [
  { type: 'checking', balance: 0, unlocked: false },
  { type: 'savings', balance: 0, unlocked: false },
  { type: 'credit', balance: 0, creditLimit: 0, unlocked: false },
  { type: 'hys', balance: 0, interestRate: 0.04, unlocked: false },
  { type: 'brokerage', balance: 0, unlocked: false },
  { type: 'ira', balance: 0, unlocked: false },
  { type: 'roth', balance: 0, unlocked: false },
  { type: '401k', balance: 0, unlocked: false },
];

const getInitialProfile = (difficulty: Difficulty, ageTrack: AgeTrack): Partial<PlayerProfile> => {
  const baseProfile = {
    age: ageTrack === 'student' ? 14 : 25,
    netWorth: 0,
    happiness: 70,
    health: 100,
    creditScore: 650,
    year: 1,
    currentYear: new Date().getFullYear(),
  };

  if (difficulty === 'easy') {
    return {
      ...baseProfile,
      netWorth: ageTrack === 'student' ? 2000000 : 2000000,
    };
  } else if (difficulty === 'medium') {
    return {
      ...baseProfile,
      netWorth: ageTrack === 'student' ? 0 : 0,
    };
  } else {
    return {
      ...baseProfile,
      netWorth: 0,
    };
  }
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      profile: {
        name: '',
        age: 14,
        gender: 'non-binary',
        avatar: '',
        difficulty: 'medium',
        ageTrack: 'student',
        netWorth: 0,
        happiness: 70,
        health: 100,
        creditScore: 650,
        year: 1,
        currentYear: new Date().getFullYear(),
      },
      accounts: initialAccounts,
      investments: [],
      marketCycle: getMarketCycle(1, 14),
      events: [],
      completedQuizzes: [],
      flags: [],
      unlockedCosmetics: [],

      initializeGame: (profileData) => {
        const difficulty = profileData.difficulty || 'medium';
        const ageTrack = profileData.ageTrack || 'student';
        const initial = getInitialProfile(difficulty, ageTrack);
        
        const newProfile: PlayerProfile = {
          name: profileData.name || '',
          age: profileData.age || initial.age || 14,
          gender: profileData.gender || 'non-binary',
          avatar: profileData.avatar || '',
          profession: profileData.profession,
          difficulty: difficulty,
          ageTrack: ageTrack,
          netWorth: initial.netWorth || 0,
          happiness: initial.happiness || 70,
          health: initial.health || 100,
          creditScore: initial.creditScore || 650,
          year: initial.year || 1,
          currentYear: initial.currentYear || new Date().getFullYear(),
        };

        // Set initial accounts based on difficulty
        const accounts = [...initialAccounts];
        if (difficulty === 'easy') {
          accounts.find(a => a.type === 'checking')!.balance = 500;
          accounts.find(a => a.type === 'savings')!.balance = 500;
          accounts.find(a => a.type === 'checking')!.unlocked = true;
          accounts.find(a => a.type === 'savings')!.unlocked = true;
        }

        set({
          profile: newProfile,
          accounts,
          marketCycle: getMarketCycle(1, newProfile.age),
          events: getEventsForAge(newProfile.age, ageTrack, []),
        });
      },

      advanceYear: () => {
        const state = get();
        const newAge = state.profile.age + 1;
        const newYear = state.profile.year + 1;
        
        // Calculate income (for adults)
        let annualIncome = 0;
        if (state.profile.ageTrack === 'adult' && state.profile.profession) {
          const profession = professions.find(p => p.name === state.profile.profession);
          annualIncome = profession?.salary || 0;
        } else if (state.profile.ageTrack === 'student') {
          // Student income based on difficulty
          if (state.profile.difficulty === 'easy') {
            annualIncome = 24000;
          } else if (state.profile.difficulty === 'medium') {
            annualIncome = 12000;
          } else {
            annualIncome = 4000;
          }
        }

        // Auto-deduct expenses (adults only)
        let expenses = 0;
        if (state.profile.ageTrack === 'adult') {
          expenses = annualIncome * 0.4; // Rent
          expenses += annualIncome * 0.2; // Food
        }

        // Apply investment returns
        const marketCycle = getMarketCycle(newYear, newAge);
        const accounts = [...state.accounts];
        const investments = [...state.investments];

        investments.forEach((inv, index) => {
          const returns = marketCycle.returns[inv.assetClass as keyof typeof marketCycle.returns];
          if (returns) {
            const returnRate = getRandomReturn(returns.min, returns.max) / 100;
            const gain = inv.amount * returnRate;
            investments[index] = { ...inv, amount: inv.amount + gain };
          }
        });

        // Apply account interest
        accounts.forEach((acc, index) => {
          if (acc.unlocked && acc.interestRate) {
            const interest = acc.balance * acc.interestRate;
            accounts[index] = { ...acc, balance: acc.balance + interest };
          }
        });

        // Handle inheritance at age 30
        let inheritance = 0;
        if (newAge === 30) {
          if (state.profile.difficulty === 'easy') {
            inheritance = 8000000;
          } else if (state.profile.difficulty === 'medium') {
            inheritance = 1100000; // $1M house + $100K assets
          }
        }

        // Update checking account with income and expenses
        const checkingAccount = accounts.find(a => a.type === 'checking');
        if (checkingAccount?.unlocked) {
          const checkingIndex = accounts.indexOf(checkingAccount);
          accounts[checkingIndex] = {
            ...checkingAccount,
            balance: checkingAccount.balance + annualIncome - expenses + inheritance,
          };
        }

        // Update profile
        const newProfile = {
          ...state.profile,
          age: newAge,
          year: newYear,
          netWorth: get().calculateNetWorth(),
        };

        // Get events for new age
        const newEvents = getEventsForAge(newAge, state.profile.ageTrack, state.flags);

        set({
          profile: newProfile,
          accounts,
          investments,
          marketCycle,
          events: newEvents,
        });
      },

      makeChoice: (choiceIndex, event) => {
        const state = get();
        const choice = choiceIndex === 0 ? event.choiceA : event.choiceB;
        const consequences = choice.consequences;

        // Apply consequences
        const accounts = [...state.accounts];
        const flags = [...state.flags];
        let happiness = state.profile.happiness;
        let creditScore = state.profile.creditScore;
        let wealthChange = 0;

        if (consequences.wealth) {
          wealthChange = consequences.wealth;
        }
        if (consequences.happiness) {
          happiness = Math.max(0, Math.min(100, state.profile.happiness + consequences.happiness));
        }
        if (consequences.creditScore) {
          creditScore = Math.max(300, Math.min(850, state.profile.creditScore + consequences.creditScore));
        }
        if (consequences.unlocks) {
          consequences.unlocks.forEach(accountType => {
            const account = accounts.find(a => a.type === accountType);
            if (account) {
              const index = accounts.indexOf(account);
              accounts[index] = { ...account, unlocked: true };
            }
          });
        }
        if (consequences.flags) {
          flags.push(...consequences.flags);
        }

        // Handle special cases
        if (flags.includes('divorced')) {
          // Divorce: lose 50% of wealth
          const netWorth = get().calculateNetWorth();
          wealthChange -= netWorth * 0.5;
        }

        // Update checking account if wealth changes
        if (wealthChange !== 0) {
          const checkingAccount = accounts.find(a => a.type === 'checking');
          if (checkingAccount?.unlocked) {
            const checkingIndex = accounts.indexOf(checkingAccount);
            accounts[checkingIndex] = {
              ...checkingAccount,
              balance: checkingAccount.balance + wealthChange,
            };
          }
        }

        // Remove the processed event
        const remainingEvents = state.events.filter(e => e !== event);

        set({
          accounts,
          flags,
          events: remainingEvents,
          profile: {
            ...state.profile,
            happiness,
            creditScore,
          },
        });
      },

      completeQuiz: (quizId) => {
        const state = get();
        set({
          completedQuizzes: [...state.completedQuizzes, quizId],
        });
      },

      updateAccount: (accountType, amount) => {
        const state = get();
        const accounts = [...state.accounts];
        const account = accounts.find(a => a.type === accountType);
        if (account) {
          const index = accounts.indexOf(account);
          accounts[index] = {
            ...account,
            balance: account.balance + amount,
          };
          set({ accounts });
        }
      },

      unlockAccount: (accountType) => {
        const state = get();
        const accounts = [...state.accounts];
        const account = accounts.find(a => a.type === accountType);
        if (account) {
          const index = accounts.indexOf(account);
          accounts[index] = {
            ...account,
            unlocked: true,
            // Set initial values for certain accounts
            ...(accountType === 'credit' && { creditLimit: 500 }),
          };
          set({ accounts });
        }
      },

      addInvestment: (assetClass, amount) => {
        const state = get();
        const investments = [...state.investments];
        const existing = investments.find(inv => inv.assetClass === assetClass);
        
        if (existing) {
          const index = investments.indexOf(existing);
          investments[index] = {
            ...existing,
            amount: existing.amount + amount,
          };
        } else {
          investments.push({
            assetClass: assetClass as any,
            amount,
            allocation: 0,
          });
        }
        
        set({ investments });
      },

      calculateNetWorth: () => {
        const state = get();
        let netWorth = 0;

        // Sum all account balances
        state.accounts.forEach(account => {
          if (account.type === 'credit') {
            // Credit cards: balance is debt, so subtract it
            netWorth -= account.balance;
          } else {
            netWorth += account.balance;
          }
        });

        // Sum all investments
        state.investments.forEach(inv => {
          netWorth += inv.amount;
        });

        return Math.round(netWorth);
      },

      resetGame: () => {
        set({
          profile: {
            name: '',
            age: 14,
            gender: 'non-binary',
            avatar: '',
            difficulty: 'medium',
            ageTrack: 'student',
            netWorth: 0,
            happiness: 70,
            health: 100,
            creditScore: 650,
            year: 1,
            currentYear: new Date().getFullYear(),
          },
          accounts: initialAccounts,
          investments: [],
          marketCycle: getMarketCycle(1, 14),
          events: [],
          completedQuizzes: [],
          flags: [],
          unlockedCosmetics: [],
        });
      },
    }),
    {
      name: 'oligarchy-game-storage',
    }
  )
);

