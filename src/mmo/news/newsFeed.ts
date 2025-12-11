// News feed system: Generates news for player actions, AI actions, market shifts, etc.
// NEVER EMPTY - Always generates ambient news, analyst commentary, rumors, etc.

import { ResourceType } from '../economy/resources';
import { Company } from '../economy/companies';

export type NewsCategory = 
  | 'headline' // Big breaking news
  | 'player_action'
  | 'ai_action'
  | 'market_shift'
  | 'crisis'
  | 'alliance'
  | 'betrayal'
  | 'takeover'
  | 'scandal'
  | 'achievement'
  | 'analyst' // Analyst commentary
  | 'rumor' // Rumors and leaks
  | 'sentiment' // Sentiment updates
  | 'government' // Government actions
  | 'media' // Media narratives
  | 'ambient'; // Ambient world news

export interface NewsItem {
  id: string;
  category: NewsCategory;
  title: string;
  content: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high';
  relatedIds: string[]; // Related player/AI/event IDs
  metadata?: Record<string, any>;
}

// Generate news for player action
export const generatePlayerActionNews = (
  playerName: string,
  action: string,
  details?: Record<string, any>
): NewsItem => {
  return {
    id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    category: 'player_action',
    title: `${playerName} ${action}`,
    content: `${playerName} has ${action}. ${details?.description || ''}`,
    timestamp: Date.now(),
    severity: 'medium',
    relatedIds: ['player'],
    metadata: details,
  };
};

// Generate news for AI action
export const generateAIActionNews = (
  aiName: string,
  action: string,
  details?: Record<string, any>
): NewsItem => {
  return {
    id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    category: 'ai_action',
    title: `${aiName} ${action}`,
    content: `${aiName} has ${action}. Market analysts are watching closely.`,
    timestamp: Date.now(),
    severity: 'low',
    relatedIds: [details?.aiId || ''],
    metadata: details,
  };
};

// Generate news for market shift
export const generateMarketShiftNews = (
  resourceType: ResourceType,
  direction: 'up' | 'down',
  magnitude: number
): NewsItem => {
  const percentage = Math.round(magnitude * 100);
  return {
    id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    category: 'market_shift',
    title: `${resourceType} prices ${direction === 'up' ? 'surge' : 'plummet'}`,
    content: `${resourceType} prices have ${direction === 'up' ? 'increased' : 'decreased'} by ${percentage}%. Traders are ${direction === 'up' ? 'optimistic' : 'concerned'}.`,
    timestamp: Date.now(),
    severity: magnitude > 0.3 ? 'high' : magnitude > 0.15 ? 'medium' : 'low',
    relatedIds: [],
    metadata: { resourceType, direction, magnitude },
  };
};

// Generate news for crisis
export const generateCrisisNews = (
  eventTitle: string,
  description: string,
  severity: 'low' | 'medium' | 'high' | 'critical'
): NewsItem => {
  return {
    id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    category: 'crisis',
    title: `BREAKING: ${eventTitle}`,
    content: description,
    timestamp: Date.now(),
    severity: severity === 'critical' ? 'high' : severity,
    relatedIds: [],
  };
};

// Generate news for alliance
export const generateAllianceNews = (
  allianceName: string,
  action: 'formed' | 'expanded' | 'dissolved',
  members: string[]
): NewsItem => {
  const actionText = action === 'formed' ? 'has been formed' : 
                    action === 'expanded' ? 'has expanded' : 
                    'has been dissolved';
  
  return {
    id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    category: 'alliance',
    title: `Alliance "${allianceName}" ${actionText}`,
    content: `The alliance "${allianceName}" ${actionText}. ${members.length > 0 ? `Members include: ${members.join(', ')}.` : ''}`,
    timestamp: Date.now(),
    severity: action === 'dissolved' ? 'medium' : 'low',
    relatedIds: members,
  };
};

// Generate news for betrayal
export const generateBetrayalNews = (
  betrayerName: string,
  allianceName: string,
  stolenAmount?: number
): NewsItem => {
  return {
    id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    category: 'betrayal',
    title: `${betrayerName} betrays ${allianceName}`,
    content: `${betrayerName} has betrayed the alliance "${allianceName}". ${stolenAmount ? `An estimated $${stolenAmount.toLocaleString()} in resources were stolen.` : 'The alliance is in disarray.'}`,
    timestamp: Date.now(),
    severity: 'high',
    relatedIds: [betrayerName],
  };
};

// Generate news for takeover
export const generateTakeoverNews = (
  acquirerName: string,
  targetName: string,
  amount?: number
): NewsItem => {
  return {
    id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    category: 'takeover',
    title: `${acquirerName} acquires ${targetName}`,
    content: `${acquirerName} has successfully acquired ${targetName}. ${amount ? `The deal was valued at $${amount.toLocaleString()}.` : 'Terms of the deal were not disclosed.'}`,
    timestamp: Date.now(),
    severity: 'high',
    relatedIds: [acquirerName, targetName],
  };
};

// Generate news for scandal
export const generateScandalNews = (
  companyName: string,
  scandalType: string,
  description: string
): NewsItem => {
  return {
    id: `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    category: 'scandal',
    title: `${companyName} embroiled in ${scandalType} scandal`,
    content: description,
    timestamp: Date.now(),
    severity: 'high',
    relatedIds: [companyName],
  };
};

// Generate ambient news (always available)
export const generateAmbientNews = (
  companies: Company[],
  marketTrend: 'up' | 'down' | 'stable',
  timeSinceLastMajorEvent: number
): NewsItem[] => {
  const items: NewsItem[] = [];
  const now = Date.now();
  
  // Analyst commentary (always generate some)
  const marketPrediction = marketTrend === 'up' ? 'continued growth' : marketTrend === 'down' ? 'market correction' : 'stable conditions';
  const economicOutlook = marketTrend === 'up' ? 'optimistic' : marketTrend === 'down' ? 'cautious' : 'stable';
  
  const analystTemplates = [
    {
      title: 'Market Analysts Weigh In',
      content: `Industry analysts predict ${marketPrediction} in the coming quarter.`,
      category: 'analyst' as NewsCategory,
    },
    {
      title: 'Economic Outlook',
      content: `Leading economists suggest ${economicOutlook} outlook for corporate earnings.`,
      category: 'analyst' as NewsCategory,
    },
  ];
  
  // Pick random analyst commentary
  const analyst = analystTemplates[Math.floor(Math.random() * analystTemplates.length)];
  items.push({
    id: `news-ambient-${now}-${Math.random().toString(36).substr(2, 9)}`,
    category: analyst.category,
    title: analyst.title,
    content: analyst.content,
    timestamp: now,
    severity: 'low',
    relatedIds: [],
  });
  
  // Rumors and leaks (if no major event recently)
  if (timeSinceLastMajorEvent > 60000) {
    const rumorTemplates = [
      {
        title: 'Insider Leak: Merger Talks?',
        content: 'Sources suggest potential merger discussions between major players. No official confirmation yet.',
        category: 'rumor' as NewsCategory,
      },
      {
        title: 'Whispers of Regulatory Changes',
        content: 'Industry insiders hint at upcoming regulatory shifts. Government officials remain tight-lipped.',
        category: 'rumor' as NewsCategory,
      },
      {
        title: 'Rumor: Major Investment',
        content: 'Unconfirmed reports of a massive investment deal in the works. Market watchers are paying close attention.',
        category: 'rumor' as NewsCategory,
      },
    ];
    
    const rumor = rumorTemplates[Math.floor(Math.random() * rumorTemplates.length)];
    items.push({
      id: `news-rumor-${now}-${Math.random().toString(36).substr(2, 9)}`,
      category: rumor.category,
      title: rumor.title,
      content: rumor.content,
      timestamp: now,
      severity: 'low',
      relatedIds: [],
    });
  }
  
  // Company-specific ambient news
  if (companies.length > 0) {
    const randomCompany = companies[Math.floor(Math.random() * companies.length)];
    const companyNews = [
      {
        title: `${randomCompany.name} Expands Operations`,
        content: `${randomCompany.name} announces expansion plans in key markets.`,
        category: 'ambient' as NewsCategory,
      },
      {
        title: `${randomCompany.name} Reports Strong Quarter`,
        content: `${randomCompany.name} shows robust performance despite market conditions.`,
        category: 'ambient' as NewsCategory,
      },
      {
        title: `${randomCompany.name} Leadership Changes`,
        content: `${randomCompany.name} makes strategic leadership appointments.`,
        category: 'ambient' as NewsCategory,
      },
    ];
    
    const news = companyNews[Math.floor(Math.random() * companyNews.length)];
    items.push({
      id: `news-company-${now}-${Math.random().toString(36).substr(2, 9)}`,
      category: news.category,
      title: news.title,
      content: news.content,
      timestamp: now,
      severity: 'low',
      relatedIds: [randomCompany.id],
    });
  }
  
  // Market sentiment updates
  const sentimentNews = [
    {
      title: 'Retail Investor Sentiment Shifts',
      content: 'Retail investors show changing risk appetite. Market volatility expected.',
      category: 'sentiment' as NewsCategory,
    },
    {
      title: 'Public Trust in Corporations',
      content: 'Latest polls show public sentiment toward corporations remains mixed.',
      category: 'sentiment' as NewsCategory,
    },
  ];
  
  const sentiment = sentimentNews[Math.floor(Math.random() * sentimentNews.length)];
  items.push({
    id: `news-sentiment-${now}-${Math.random().toString(36).substr(2, 9)}`,
    category: sentiment.category,
    title: sentiment.title,
    content: sentiment.content,
    timestamp: now,
    severity: 'low',
    relatedIds: [],
  });
  
  return items;
};

// News feed manager
export interface NewsFeedState {
  items: NewsItem[];
  maxItems: number; // Keep last N items
  lastAmbientGeneration: number;
  ambientInterval: number; // Generate ambient news every N ms
}

export const createNewsFeed = (maxItems: number = 100): NewsFeedState => {
  return {
    items: [],
    maxItems,
    lastAmbientGeneration: Date.now(),
    ambientInterval: 30000, // Every 30 seconds
  };
};

// Add news item
export const addNewsItem = (feed: NewsFeedState, item: NewsItem): NewsFeedState => {
  const items = [item, ...feed.items].slice(0, feed.maxItems);
  return {
    ...feed,
    items,
  };
};

// Ensure newsfeed is never empty - generate ambient news if needed
export const ensureNewsfeedNotEmpty = (
  feed: NewsFeedState,
  companies: Company[],
  marketTrend: 'up' | 'down' | 'stable',
  lastMajorEventTime: number
): NewsFeedState => {
  const now = Date.now();
  
  // If feed is empty or it's been a while since ambient news, generate some
  if (feed.items.length === 0 || (now - feed.lastAmbientGeneration) > feed.ambientInterval) {
    const ambientNews = generateAmbientNews(companies, marketTrend, now - lastMajorEventTime);
    let updatedFeed = feed;
    
    ambientNews.forEach(news => {
      updatedFeed = addNewsItem(updatedFeed, news);
    });
    
    return {
      ...updatedFeed,
      lastAmbientGeneration: now,
    };
  }
  
  return feed;
};

// Get recent news
export const getRecentNews = (feed: NewsFeedState, limit: number = 20): NewsItem[] => {
  return feed.items.slice(0, limit);
};

// Get news by category
export const getNewsByCategory = (feed: NewsFeedState, category: NewsCategory): NewsItem[] => {
  return feed.items.filter(item => item.category === category);
};

// Get headlines (big news)
export const getHeadlines = (feed: NewsFeedState, limit: number = 5): NewsItem[] => {
  return feed.items
    .filter(item => item.category === 'headline' || item.severity === 'high')
    .slice(0, limit);
};

