// Media system: Media outlets, PR campaigns, and narrative control

export type MediaOutletType = 
  | 'tv_network'
  | 'newspaper'
  | 'social_platform'
  | 'news_aggregator'
  | 'podcast_network';

export interface MediaOutlet {
  id: string;
  name: string;
  type: MediaOutletType;
  ownerId?: string; // Company that owns it
  influence: number; // 0-100, reach and impact
  reach: number; // Audience size
  bias: 'pro_business' | 'neutral' | 'populist' | 'green' | 'nationalist';
  price: number; // Cost to acquire
  forSale: boolean;
}

export interface PRCampaign {
  id: string;
  companyId: string;
  outletId?: string; // If using specific outlet
  type: 'reputation_boost' | 'damage_control' | 'stock_pump' | 'sentiment_shift' | 'greenwashing';
  target: 'self' | string; // Target company ID or 'self'
  cost: number;
  duration: number; // milliseconds
  startedAt: number;
  expiresAt: number;
  effect: PRCampaignEffect;
  active: boolean;
  canBackfire: boolean;
  backfireChance: number; // 0-1
}

export interface PRCampaignEffect {
  reputationChange?: number; // -10 to +10
  sentimentShift?: number; // -1 to 1
  stockPriceBoost?: number; // Percentage
  publicTrustChange?: number; // -5 to +5
}

export interface MediaState {
  outlets: MediaOutlet[];
  activeCampaigns: PRCampaign[];
  narrativeFrames: NarrativeFrame[]; // How events are being framed
  lastUpdate: number;
}

export interface NarrativeFrame {
  id: string;
  eventId: string;
  frame: 'pro_business' | 'anti_corporate' | 'neutral' | 'crisis' | 'opportunity';
  outlets: string[]; // Outlet IDs pushing this frame
  publicImpact: number; // -1 to 1, how this affects public sentiment
}

// Initialize media state
export const createMediaState = (): MediaState => {
  // Create some initial media outlets
  const outlets: MediaOutlet[] = [
    {
      id: 'outlet-1',
      name: 'Global News Network',
      type: 'tv_network',
      influence: 80,
      reach: 1000000,
      bias: 'neutral',
      price: 50000000,
      forSale: true,
    },
    {
      id: 'outlet-2',
      name: 'Business Times',
      type: 'newspaper',
      influence: 60,
      reach: 500000,
      bias: 'pro_business',
      price: 30000000,
      forSale: true,
    },
    {
      id: 'outlet-3',
      name: 'Social Platform X',
      type: 'social_platform',
      influence: 70,
      reach: 2000000,
      bias: 'neutral',
      price: 80000000,
      forSale: true,
    },
  ];
  
  return {
    outlets,
    activeCampaigns: [],
    narrativeFrames: [],
    lastUpdate: Date.now(),
  };
};

// Launch a PR campaign
export const launchPRCampaign = (
  media: MediaState,
  campaign: PRCampaign
): MediaState => {
  return {
    ...media,
    activeCampaigns: [...media.activeCampaigns, campaign],
    lastUpdate: Date.now(),
  };
};

// Check if campaign backfires
export const checkCampaignBackfire = (campaign: PRCampaign): boolean => {
  if (!campaign.canBackfire) return false;
  return Math.random() < campaign.backfireChance;
};

// Acquire a media outlet
export const acquireMediaOutlet = (
  media: MediaState,
  outletId: string,
  buyerId: string
): MediaState => {
  return {
    ...media,
    outlets: media.outlets.map(outlet =>
      outlet.id === outletId
        ? { ...outlet, ownerId: buyerId, forSale: false }
        : outlet
    ),
    lastUpdate: Date.now(),
  };
};

// Frame an event through media
export const frameEvent = (
  media: MediaState,
  eventId: string,
  frame: NarrativeFrame['frame'],
  outletIds: string[]
): MediaState => {
  const narrativeFrame: NarrativeFrame = {
    id: `frame-${Date.now()}`,
    eventId,
    frame,
    outlets: outletIds,
    publicImpact: frame === 'pro_business' ? 0.2 : frame === 'anti_corporate' ? -0.3 : 0,
  };
  
  return {
    ...media,
    narrativeFrames: [...media.narrativeFrames, narrativeFrame],
    lastUpdate: Date.now(),
  };
};

// Get total media influence for a company
export const getCompanyMediaInfluence = (
  media: MediaState,
  companyId: string
): number => {
  const ownedOutlets = media.outlets.filter(o => o.ownerId === companyId);
  return ownedOutlets.reduce((sum, outlet) => sum + outlet.influence, 0);
};

