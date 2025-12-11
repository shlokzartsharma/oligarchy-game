// People layer: Public sentiment and retail investors
// This affects government, markets, and company reputation

export interface PublicSentiment {
  trustInCorporations: number; // 0-100
  angerAtMonopolies: number; // 0-100
  environmentalConcern: number; // 0-100
  nationalism: number; // 0-100 (vs globalism)
  economicOptimism: number; // 0-100
  lastUpdate: number;
}

export interface RetailInvestorState {
  riskAppetite: number; // 0-100, higher = more willing to take risks
  memeStockMania: number; // 0-100, higher = more speculative trading
  favoriteIndustries: Record<string, number>; // industry -> enthusiasm (0-100)
  lastUpdate: number;
}

export interface PeopleState {
  sentiment: PublicSentiment;
  retailInvestors: RetailInvestorState;
  lastUpdate: number;
}

// Initialize people state
export const createPeopleState = (): PeopleState => {
  return {
    sentiment: {
      trustInCorporations: 50,
      angerAtMonopolies: 30,
      environmentalConcern: 40,
      nationalism: 50,
      economicOptimism: 60,
      lastUpdate: Date.now(),
    },
    retailInvestors: {
      riskAppetite: 50,
      memeStockMania: 20,
      favoriteIndustries: {},
      lastUpdate: Date.now(),
    },
    lastUpdate: Date.now(),
  };
};

// Update sentiment based on events
export const updateSentiment = (
  people: PeopleState,
  factors: {
    corporateScandal?: boolean;
    monopolyReveal?: boolean;
    environmentalDisaster?: boolean;
    economicBoom?: boolean;
    economicCrisis?: boolean;
    nationalistPolicy?: boolean;
    globalistPolicy?: boolean;
  }
): PeopleState => {
  let sentiment = { ...people.sentiment };
  
  if (factors.corporateScandal) {
    sentiment.trustInCorporations = Math.max(0, sentiment.trustInCorporations - 10);
    sentiment.angerAtMonopolies = Math.min(100, sentiment.angerAtMonopolies + 5);
  }
  
  if (factors.monopolyReveal) {
    sentiment.angerAtMonopolies = Math.min(100, sentiment.angerAtMonopolies + 15);
    sentiment.trustInCorporations = Math.max(0, sentiment.trustInCorporations - 5);
  }
  
  if (factors.environmentalDisaster) {
    sentiment.environmentalConcern = Math.min(100, sentiment.environmentalConcern + 20);
    sentiment.trustInCorporations = Math.max(0, sentiment.trustInCorporations - 5);
  }
  
  if (factors.economicBoom) {
    sentiment.economicOptimism = Math.min(100, sentiment.economicOptimism + 10);
    sentiment.trustInCorporations = Math.min(100, sentiment.trustInCorporations + 5);
  }
  
  if (factors.economicCrisis) {
    sentiment.economicOptimism = Math.max(0, sentiment.economicOptimism - 20);
    sentiment.trustInCorporations = Math.max(0, sentiment.trustInCorporations - 10);
  }
  
  if (factors.nationalistPolicy) {
    sentiment.nationalism = Math.min(100, sentiment.nationalism + 10);
  }
  
  if (factors.globalistPolicy) {
    sentiment.nationalism = Math.max(0, sentiment.nationalism - 10);
  }
  
  return {
    ...people,
    sentiment: {
      ...sentiment,
      lastUpdate: Date.now(),
    },
    lastUpdate: Date.now(),
  };
};

// Update retail investor behavior
export const updateRetailInvestors = (
  people: PeopleState,
  factors: {
    marketCrash?: boolean;
    marketBoom?: boolean;
    memeStockEvent?: boolean;
    industryHype?: string; // Industry ID
  }
): PeopleState => {
  let retail = { ...people.retailInvestors };
  
  if (factors.marketCrash) {
    retail.riskAppetite = Math.max(0, retail.riskAppetite - 20);
    retail.memeStockMania = Math.max(0, retail.memeStockMania - 10);
  }
  
  if (factors.marketBoom) {
    retail.riskAppetite = Math.min(100, retail.riskAppetite + 15);
    retail.memeStockMania = Math.min(100, retail.memeStockMania + 5);
  }
  
  if (factors.memeStockEvent) {
    retail.memeStockMania = Math.min(100, retail.memeStockMania + 30);
    retail.riskAppetite = Math.min(100, retail.riskAppetite + 10);
  }
  
  if (factors.industryHype) {
    const current = retail.favoriteIndustries[factors.industryHype] || 0;
    retail.favoriteIndustries = {
      ...retail.favoriteIndustries,
      [factors.industryHype]: Math.min(100, current + 20),
    };
  }
  
  return {
    ...people,
    retailInvestors: {
      ...retail,
      lastUpdate: Date.now(),
    },
    lastUpdate: Date.now(),
  };
};

// Get sentiment impact on company reputation
export const getSentimentReputationImpact = (
  people: PeopleState,
  companyIndustry: string,
  _companyReputation: number
): number => {
  let impact = 0;
  
  // Trust in corporations affects all companies
  const trustFactor = (people.sentiment.trustInCorporations - 50) / 50; // -1 to 1
  impact += trustFactor * 5;
  
  // Industry-specific sentiment
  const industryEnthusiasm = people.retailInvestors.favoriteIndustries[companyIndustry] || 50;
  const enthusiasmFactor = (industryEnthusiasm - 50) / 50;
  impact += enthusiasmFactor * 3;
  
  // Environmental concern affects energy companies more
  if (companyIndustry === 'energy') {
    const envFactor = (people.sentiment.environmentalConcern - 50) / 50;
    impact -= envFactor * 5; // Negative for energy
  }
  
  return Math.round(impact);
};

