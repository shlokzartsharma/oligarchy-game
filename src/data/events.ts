import { YearEvent } from '../types/game';

export const studentEvents: YearEvent[] = [
  {
    age: 14,
    title: 'Opening Your First Bank Account',
    description: 'You need to open a checking and savings account. What do you do?',
    choiceA: {
      text: 'Research banks and choose one with good rates',
      consequences: {
        wealth: 0,
        happiness: 5,
        unlocks: ['checking', 'savings'],
        message: 'Great choice! You opened accounts with competitive rates.',
      },
    },
    choiceB: {
      text: 'Just pick the first bank you see',
      consequences: {
        wealth: 0,
        happiness: 0,
        unlocks: ['checking', 'savings'],
        message: 'You opened accounts, but could have gotten better rates.',
      },
    },
  },
  {
    age: 15,
    title: 'Credit Card Responsibility',
    description: 'You got your first credit card with a $500 limit. How do you use it?',
    choiceA: {
      text: 'Use it for small purchases and pay it off monthly',
      consequences: {
        creditScore: 20,
        happiness: 5,
        message: 'Smart! You\'re building good credit habits.',
      },
    },
    choiceB: {
      text: 'Max it out on things you want',
      consequences: {
        creditScore: -30,
        happiness: -10,
        message: 'Uh oh! High credit utilization hurts your score.',
      },
    },
  },
  {
    age: 15,
    title: 'Protecting Your Credit',
    description: 'A friend asks to borrow your credit card. What do you do?',
    choiceA: {
      text: 'Politely decline and explain why',
      consequences: {
        creditScore: 0,
        happiness: 0,
        message: 'Good call! Never share your credit card information.',
      },
    },
    choiceB: {
      text: 'Let them use it, they\'re trustworthy',
      consequences: {
        creditScore: -50,
        happiness: -15,
        message: 'Your friend made unauthorized charges. Your credit score dropped.',
      },
    },
  },
  {
    age: 16,
    title: 'Budgeting Your Income',
    description: 'You have income now. How do you allocate it?',
    choiceA: {
      text: 'Save 50%, spend 30%, invest 20%',
      consequences: {
        wealth: 0,
        happiness: 10,
        message: 'Excellent budgeting! You\'re building wealth.',
      },
    },
    choiceB: {
      text: 'Spend most of it, save a little',
      consequences: {
        wealth: 0,
        happiness: 5,
        message: 'You\'re having fun, but not building much wealth.',
      },
    },
  },
  {
    age: 17,
    title: 'Investing Basics',
    description: 'You learned about investing. Do you open a brokerage account?',
    choiceA: {
      text: 'Yes, start investing with $100',
      consequences: {
        wealth: -100,
        unlocks: ['brokerage'],
        happiness: 5,
        message: 'You opened a brokerage account and made your first investment!',
      },
    },
    choiceB: {
      text: 'No, keep everything in savings',
      consequences: {
        wealth: 0,
        happiness: 0,
        message: 'You\'re playing it safe, but missing out on growth potential.',
      },
    },
  },
];

export const adultEvents: YearEvent[] = [
  {
    age: 27,
    title: 'Finding a Partner',
    description: 'You\'ve been dating someone. They seem...',
    choiceA: {
      text: 'Responsible, financially stable, and supportive',
      consequences: {
        happiness: 20,
        flags: ['good_partner'],
        message: 'Great choice! This relationship will be stable.',
      },
    },
    choiceB: {
      text: 'Fun and exciting, but financially irresponsible',
      consequences: {
        happiness: 10,
        flags: ['bad_partner'],
        message: 'They\'re fun, but there might be trouble ahead...',
      },
    },
  },
  {
    age: 28,
    title: 'Car Upgrade',
    description: 'Your old car is breaking down. What do you do?',
    choiceA: {
      text: 'Buy a new reliable car ($30,000)',
      consequences: {
        wealth: -30000,
        happiness: 15,
        message: 'You bought a new car. It\'s reliable and makes you happy.',
      },
    },
    choiceB: {
      text: 'Keep fixing the old one',
      consequences: {
        wealth: -5000,
        happiness: -5,
        message: 'You saved money, but the constant repairs are annoying.',
      },
    },
  },
  {
    age: 29,
    title: 'Unexpected Bonus',
    description: 'You received a $10,000 bonus at work!',
    choiceA: {
      text: 'Invest it in your retirement account',
      consequences: {
        wealth: 0,
        happiness: 5,
        message: 'Smart move! This will grow significantly over time.',
      },
    },
    choiceB: {
      text: 'Take a vacation and enjoy it',
      consequences: {
        wealth: -10000,
        happiness: 20,
        message: 'You had an amazing vacation! Memories are priceless.',
      },
    },
  },
  {
    age: 30,
    title: 'Relationship Check',
    description: 'You\'ve been with your partner for a while now...',
    choiceA: {
      text: 'Commit to a long-term future together',
      consequences: {
        happiness: 10,
        flags: ['secure_relationship'],
        message: 'You\'ve secured your relationship. No divorce risk!',
      },
    },
    choiceB: {
      text: 'Keep things casual',
      consequences: {
        happiness: 0,
        message: 'You\'re keeping your options open.',
      },
    },
  },
  {
    age: 32,
    title: 'Market Downturn',
    description: 'The market is crashing! Your portfolio is down 20%.',
    choiceA: {
      text: 'Stay invested and ride it out',
      consequences: {
        wealth: 0,
        happiness: -5,
        flags: ['stayed_invested'],
        message: 'You stayed calm. Markets recover over time.',
      },
    },
    choiceB: {
      text: 'Sell everything to stop the losses',
      consequences: {
        wealth: 0,
        happiness: -15,
        flags: ['panic_sold'],
        message: 'You locked in your losses. Markets recovered later.',
      },
    },
  },
  {
    age: 35,
    title: 'Divorce Risk',
    description: 'Your relationship is falling apart...',
    choiceA: {
      text: 'Work through it together',
      consequences: {
        happiness: 10,
        flags: ['avoided_divorce'],
        message: 'You worked it out! Your relationship is stronger.',
      },
    },
    choiceB: {
      text: 'Get divorced',
      consequences: {
        wealth: 0, // Will be calculated as -50% in game logic
        happiness: -30,
        flags: ['divorced'],
        message: 'Divorce is expensive. You lost 50% of your wealth.',
      },
    },
    required: false, // Only if bad_partner flag exists
  },
  {
    age: 40,
    title: 'Buying a Home',
    description: 'You\'re thinking about buying a house.',
    choiceA: {
      text: 'Buy a house ($400,000)',
      consequences: {
        wealth: -400000,
        happiness: 20,
        message: 'You bought a home! It\'s a major investment.',
      },
    },
    choiceB: {
      text: 'Keep renting',
      consequences: {
        wealth: -20000, // Annual rent
        happiness: 0,
        message: 'You continue renting. No equity, but more flexibility.',
      },
    },
  },
  {
    age: 42,
    title: 'Having Kids',
    description: 'You\'re considering starting a family.',
    choiceA: {
      text: 'Have a child',
      consequences: {
        wealth: -15000, // Annual cost
        happiness: 25,
        flags: ['has_child'],
        message: 'Congratulations! A child costs about $15,000/year.',
      },
    },
    choiceB: {
      text: 'Not ready yet',
      consequences: {
        happiness: 0,
        message: 'You\'re waiting for the right time.',
      },
    },
  },
];

export const getEventsForAge = (age: number, ageTrack: 'student' | 'adult', flags: string[]): YearEvent[] => {
  if (ageTrack === 'student') {
    return studentEvents.filter(e => e.age === age);
  } else {
    const events = adultEvents.filter(e => {
      if (e.age === age) {
        // Check if event is conditional
        if (e.age === 35 && !flags.includes('bad_partner')) {
          return false;
        }
        return true;
      }
      return false;
    });
    return events;
  }
};

