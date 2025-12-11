// Marketplace: Player-to-player and player-to-AI trading UI
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMmoStore } from '../state/worldStore';
import { ResourceType, RESOURCES } from '../economy/resources';
// import { createTradeOffer } from './tradingEngine'; // Unused for now

const Marketplace = () => {
  const { playerCompanyId, companies, tradeOffers } = useMmoStore();
  const player = playerCompanyId ? companies.find(c => c.id === playerCompanyId) : null;
  // const aiCompanies = companies.filter(c => !c.isPlayer); // Unused
  const [selectedResource, setSelectedResource] = useState<ResourceType | null>(null);
  const [offerAmount, setOfferAmount] = useState(0);
  const [requestAmount, setRequestAmount] = useState(0);

  if (!player) return null;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
      >
        <h3 className="text-2xl font-bold text-navy mb-4">Create Trade Offer</h3>
        
        <div className="grid md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="text-navy/70 text-sm mb-2 block">Offer Resource</label>
            <select
              value={selectedResource || ''}
              onChange={(e) => setSelectedResource(e.target.value as ResourceType)}
              className="w-full p-2 border border-navy/20 rounded-lg"
            >
              <option value="">Select resource...</option>
              {(Object.keys(RESOURCES) as ResourceType[]).map(type => (
                <option key={type} value={type}>
                  {RESOURCES[type].name}
                </option>
              ))}
            </select>
            {selectedResource && (
              <input
                type="number"
                min="0"
                value={offerAmount}
                onChange={(e) => setOfferAmount(parseInt(e.target.value) || 0)}
                placeholder="Amount"
                className="w-full mt-2 p-2 border border-navy/20 rounded-lg"
              />
            )}
          </div>

          <div>
            <label className="text-navy/70 text-sm mb-2 block">Request Resource</label>
            <select className="w-full p-2 border border-navy/20 rounded-lg">
              <option value="">Select resource...</option>
              {(Object.keys(RESOURCES) as ResourceType[]).map(type => (
                <option key={type} value={type}>
                  {RESOURCES[type].name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              value={requestAmount}
              onChange={(e) => setRequestAmount(parseInt(e.target.value) || 0)}
              placeholder="Amount"
              className="w-full mt-2 p-2 border border-navy/20 rounded-lg"
            />
          </div>
        </div>

        <button className="px-6 py-2 bg-gold text-navy font-semibold rounded-lg hover:shadow-lg">
          Create Offer
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
      >
        <h3 className="text-xl font-bold text-navy mb-4">Active Trade Offers</h3>
        {tradeOffers.length === 0 ? (
          <div className="text-navy/50 text-center py-4">No active offers</div>
        ) : (
          <div className="space-y-2">
            {(tradeOffers as any[]).map((offer: any) => (
              <div key={offer.id} className="p-3 bg-navy/5 rounded">
                <div className="font-semibold text-navy">
                  {offer.fromName} → {offer.toName}
                </div>
                <div className="text-sm text-navy/70">
                  Status: {offer.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Marketplace;

