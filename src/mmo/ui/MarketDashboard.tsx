// Market Dashboard: Real-time market prices, buy/sell interface
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMmoStore } from '../state/worldStore';
import { ResourceType, RESOURCES } from '../economy/resources';
import { getMarketPrice } from '../state/systemsStore';

const MarketDashboard = () => {
  const { systems, buyResource } = useMmoStore();
  const [selectedResource, setSelectedResource] = useState<ResourceType | null>(null);
  const [buyAmount, setBuyAmount] = useState(1);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
      >
        <h3 className="text-2xl font-bold text-navy mb-4">Market Prices</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {(Object.keys(RESOURCES) as ResourceType[]).map(type => {
            const resource = RESOURCES[type];
            const price = getMarketPrice(systems, type);
            const priceChange = ((price - resource.basePrice) / resource.basePrice) * 100;
            
            return (
              <motion.div
                key={type}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedResource(type)}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${selectedResource === type
                    ? 'border-gold bg-gold/10'
                    : 'border-navy/20 bg-navy/5'
                  }
                `}
              >
                <div className="font-semibold text-navy">{resource.name}</div>
                <div className="text-xl font-bold text-soft-green">
                  ${price.toLocaleString()}
                </div>
                <div className={`text-sm ${priceChange >= 0 ? 'text-soft-green' : 'text-soft-red'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {selectedResource && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10"
        >
          <h3 className="text-xl font-bold text-navy mb-4">
            Buy {RESOURCES[selectedResource].name}
          </h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-navy/70 text-sm mb-2 block">Amount</label>
              <input
                type="number"
                min="1"
                value={buyAmount}
                onChange={(e) => setBuyAmount(parseInt(e.target.value) || 1)}
                className="w-full p-2 border border-navy/20 rounded-lg"
              />
            </div>
            <div>
              <div className="text-navy/70 text-sm mb-2">Total Cost</div>
              <div className="text-xl font-bold text-navy">
                ${(getMarketPrice(systems, selectedResource) * buyAmount).toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => buyResource(selectedResource, buyAmount)}
              className="px-6 py-2 bg-gold text-navy font-semibold rounded-lg hover:shadow-lg"
            >
              Buy
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MarketDashboard;

