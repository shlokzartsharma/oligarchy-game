// News Feed Panel: Display world news with framer-motion ticker
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorldStore } from '../state/worldStore';
import { NewsItem, getRecentNews } from './newsFeed';

const NewsFeedPanel = () => {
  const { newsFeed } = useWorldStore();
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    const recent = getRecentNews(newsFeed, 20);
    setNewsItems(recent);
  }, [newsFeed]);

  const getSeverityColor = (severity: NewsItem['severity']) => {
    switch (severity) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-navy/70';
      default:
        return 'text-navy/70';
    }
  };

  const getCategoryColor = (category: NewsItem['category']) => {
    switch (category) {
      case 'headline':
      case 'crisis':
        return 'border-red-500';
      case 'takeover':
      case 'betrayal':
        return 'border-orange-500';
      case 'player_action':
      case 'ai_action':
        return 'border-blue-500';
      case 'market_shift':
        return 'border-green-500';
      default:
        return 'border-gold';
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-navy/10 h-96 overflow-hidden">
      <h3 className="text-xl font-bold text-navy mb-4">News Feed</h3>
      <div className="h-80 overflow-y-auto space-y-3">
        <AnimatePresence>
          {newsItems.length === 0 ? (
            <div className="text-navy/50 text-center py-8">No news yet</div>
          ) : (
            newsItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 bg-navy/5 rounded-lg border-l-4 ${getCategoryColor(item.category)}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-navy text-sm">{item.title}</h4>
                  <span className={`text-xs font-semibold ${getSeverityColor(item.severity)}`}>
                    {item.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-navy/70">{item.content}</p>
                <div className="text-xs text-navy/50 mt-1">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NewsFeedPanel;
