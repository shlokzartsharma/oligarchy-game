import { Quiz } from '../types/game';

export const quizzes: Quiz[] = [
  {
    id: 'checking-savings',
    title: 'Checking & Savings Accounts',
    passingScore: 75,
    unlocks: ['checking', 'savings'],
    questions: [
      {
        question: 'What is the main difference between a checking and savings account?',
        options: [
          'Checking accounts earn interest, savings accounts don\'t',
          'Savings accounts are for long-term storage, checking is for daily transactions',
          'There is no difference',
          'Checking accounts require a minimum balance',
        ],
        correctAnswer: 1,
        explanation: 'Savings accounts are designed for storing money long-term and earning interest, while checking accounts are for daily transactions like paying bills.',
      },
      {
        question: 'What documents do you typically need to open a bank account?',
        options: [
          'Just your name',
          'ID, Social Security Number, and proof of address',
          'A credit card',
          'Nothing, anyone can open an account',
        ],
        correctAnswer: 1,
        explanation: 'Banks require identification (ID), Social Security Number, and proof of address to open an account for security and legal compliance.',
      },
      {
        question: 'What is an interest rate?',
        options: [
          'The fee banks charge you',
          'The percentage the bank pays you for keeping money in your account',
          'The amount you owe',
          'A type of loan',
        ],
        correctAnswer: 1,
        explanation: 'An interest rate is the percentage a bank pays you for keeping your money in their account. Savings accounts typically have higher interest rates than checking accounts.',
      },
      {
        question: 'What is a minimum balance requirement?',
        options: [
          'The maximum you can deposit',
          'The smallest amount you must keep in the account to avoid fees',
          'The interest rate',
          'The account number',
        ],
        correctAnswer: 1,
        explanation: 'A minimum balance requirement is the smallest amount you must keep in your account to avoid monthly maintenance fees.',
      },
    ],
  },
  {
    id: 'credit-cards',
    title: 'Credit Cards & Credit Scores',
    passingScore: 75,
    unlocks: ['credit'],
    questions: [
      {
        question: 'What is a credit score?',
        options: [
          'The amount of money you have',
          'A number that represents how trustworthy you are with credit',
          'Your bank account balance',
          'The interest rate on your savings',
        ],
        correctAnswer: 1,
        explanation: 'A credit score is a number (300-850) that represents how trustworthy lenders think you are based on your credit history.',
      },
      {
        question: 'What is the ideal credit utilization ratio?',
        options: [
          '100%',
          '50%',
          'Under 30%',
          '0%',
        ],
        correctAnswer: 2,
        explanation: 'Keeping your credit utilization under 30% shows lenders you\'re responsible and helps improve your credit score.',
      },
      {
        question: 'What happens if you don\'t pay your credit card bill on time?',
        options: [
          'Nothing',
          'Your credit score goes down and you pay late fees',
          'You get free money',
          'Your credit limit increases',
        ],
        correctAnswer: 1,
        explanation: 'Missing payments hurts your credit score significantly and results in late fees and interest charges.',
      },
      {
        question: 'What is the best way to build credit?',
        options: [
          'Max out your credit cards',
          'Use credit cards regularly and pay them off in full each month',
          'Never use credit cards',
          'Only pay the minimum balance',
        ],
        correctAnswer: 1,
        explanation: 'Using credit cards responsibly (making purchases and paying them off in full each month) builds good credit history.',
      },
    ],
  },
  {
    id: 'investing-basics',
    title: 'Investing Basics',
    passingScore: 75,
    unlocks: ['brokerage'],
    questions: [
      {
        question: 'What is compound interest?',
        options: [
          'Interest that decreases over time',
          'Interest earned on both your principal and previously earned interest',
          'A type of loan',
          'The same as simple interest',
        ],
        correctAnswer: 1,
        explanation: 'Compound interest means you earn interest on your initial investment AND on the interest you\'ve already earned, leading to exponential growth over time.',
      },
      {
        question: 'What is the difference between investing and speculating?',
        options: [
          'There is no difference',
          'Investing is long-term based on fundamentals, speculating is short-term gambling',
          'Speculating is safer',
          'Investing is only for rich people',
        ],
        correctAnswer: 1,
        explanation: 'Investing involves buying assets for long-term growth based on fundamentals, while speculating is short-term betting on price movements.',
      },
      {
        question: 'What is diversification?',
        options: [
          'Putting all your money in one stock',
          'Spreading your investments across different asset classes to reduce risk',
          'Only investing in stocks',
          'Avoiding investments',
        ],
        correctAnswer: 1,
        explanation: 'Diversification means spreading your investments across different types of assets (stocks, bonds, real estate) to reduce risk.',
      },
      {
        question: 'What typically happens during a market downturn?',
        options: [
          'All investments go to zero',
          'Stock prices fall, but historically markets recover over time',
          'You should always sell everything',
          'Only bonds are affected',
        ],
        correctAnswer: 1,
        explanation: 'Market downturns are normal. While prices fall, historically markets have always recovered over the long term. Panic selling locks in losses.',
      },
    ],
  },
];

