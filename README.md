# Oligarchy: Quick Play

A financial literacy educational game built with React, TypeScript, and modern web technologies.

## Features

- **Interactive Financial Education**: Learn about banking, credit, budgeting, and investing through gameplay
- **Two Game Modes**: 
  - Student mode (ages 14-18) - Learn the basics
  - Adult mode (ages 25-65) - Full career simulation
- **Three Difficulty Levels**: Easy (wealthy), Medium (middle-class), Hard (working-class)
- **Quiz System**: Pass quizzes to unlock new financial accounts
- **Market Cycles**: Experience bull markets, recessions, and bear markets
- **Life Events**: Make choices that affect your financial future
- **Beautiful UI**: Stardew Valley x Monopoly Go x BitLife aesthetic with smooth animations

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management with persistence
- **React Router** - Navigation
- **Recharts** - Investment graphs
- **Vite** - Build tool

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The game will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Game Flow

1. **Splash Screen** - Welcome screen
2. **Compliance Screen** - Educational intent and Ollie introduction
3. **Character Creation** - Name, gender, age track, avatar
4. **Difficulty Selection** - Choose your socioeconomic background
5. **Profession Selection** (Adults only) - Choose your career
6. **Main Game** - Year-by-year progression with A/B choices
7. **Quizzes** - Pass quizzes to unlock accounts
8. **Year Summary** - Review your progress
9. **Retirement/Graduation** - Final summary and achievements

## Game Mechanics

### Student Mode (Ages 14-18)

- **Year 1**: Learn about checking and savings accounts
- **Year 2**: Credit cards and credit scores
- **Year 3**: Budgeting and income management
- **Year 4**: Investing basics and market dynamics

### Adult Mode (Ages 25-65)

- Annual income based on profession
- Automatic expense deductions (rent, food, disposable)
- Investment returns based on market cycles
- Life events with branching consequences
- Inheritance at age 30 (based on difficulty)

### Market Cycles

- **Bull Market**: High returns on stocks and crypto
- **Recession/Bear Market**: Stocks decline, bonds and gold are safe havens
- **Normal Market**: Moderate returns across asset classes

### Win Condition

Reach $1,000,000 net worth by age 18 (students) or 65 (adults) to unlock the "Oligarchy MMO (Utopia Mode)" achievement.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── HUD.tsx      # Game HUD with stats
│   ├── ChoiceCard.tsx # Swipeable choice cards
│   └── Ollie.tsx    # Mascot component
├── screens/         # Screen components
│   ├── SplashScreen.tsx
│   ├── ComplianceScreen.tsx
│   ├── CharacterCreationScreen.tsx
│   ├── DifficultySelectionScreen.tsx
│   ├── ProfessionSelectionScreen.tsx
│   ├── MainGameScreen.tsx
│   ├── QuizScreen.tsx
│   ├── YearSummaryScreen.tsx
│   └── RetirementScreen.tsx
├── store/           # Zustand state management
│   └── gameStore.ts # Main game state
├── data/            # Game data
│   ├── professions.ts
│   ├── marketCycles.ts
│   ├── events.ts
│   └── quizzes.ts
├── types/           # TypeScript types
│   └── game.ts
└── utils/           # Utilities
    ├── sounds.ts    # Web Audio API sound effects
    └── confetti.tsx # Confetti animation
```

## License

MIT

