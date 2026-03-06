import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getMarketData } from '../services/api';

// Static fallback data shown when the live API is unavailable
const FALLBACK_DATA = [
  { id: 'bitcoin', symbol: 'BTC', current_price: 68420, price_change_percentage_24h: 2.3, image: '' },
  { id: 'ethereum', symbol: 'ETH', current_price: 3521, price_change_percentage_24h: 1.8, image: '' },
  { id: 'solana', symbol: 'SOL', current_price: 182, price_change_percentage_24h: -0.9, image: '' },
  { id: 'bnb', symbol: 'BNB', current_price: 578, price_change_percentage_24h: 0.6, image: '' },
  { id: 'xrp', symbol: 'XRP', current_price: 0.62, price_change_percentage_24h: 3.1, image: '' },
  { id: 'cardano', symbol: 'ADA', current_price: 0.48, price_change_percentage_24h: -1.2, image: '' },
  { id: 'dogecoin', symbol: 'DOGE', current_price: 0.18, price_change_percentage_24h: 4.5, image: '' },
  { id: 'avalanche', symbol: 'AVAX', current_price: 38.2, price_change_percentage_24h: 2.1, image: '' },
  { id: 'polkadot', symbol: 'DOT', current_price: 7.84, price_change_percentage_24h: -0.4, image: '' },
  { id: 'chainlink', symbol: 'LINK', current_price: 14.2, price_change_percentage_24h: 1.5, image: '' },
  { id: 'matic', symbol: 'MATIC', current_price: 0.86, price_change_percentage_24h: -0.7, image: '' },
  { id: 'uniswap', symbol: 'UNI', current_price: 9.3, price_change_percentage_24h: 0.9, image: '' },
];

export function CryptoTicker() {
  const [tickerData, setTickerData] = useState<any[]>([...FALLBACK_DATA, ...FALLBACK_DATA]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getMarketData({ per_page: 15 });
        if (data && data.length > 0) {
          setTickerData([...data, ...data]);
          setIsLive(true);
        }
      } catch (err) {
        // Silently fall back to static data — ticker is always visible
        console.warn('CryptoTicker: using fallback data (API unavailable)');
      }
    };
    loadData();
  }, []);

  return (
    <div className="w-full overflow-hidden bg-bg-surface border border-border py-3 rounded-2xl mb-6 relative z-10">
      {/* Live indicator */}
      <div className="absolute top-1.5 right-3 flex items-center gap-1 z-10">
        <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
        <span className="text-[9px] text-text-muted font-mono uppercase">{isLive ? 'Live' : 'Static'}</span>
      </div>

      <motion.div
        className="flex gap-12 w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
      >
        {tickerData.map((coin, i) => (
          <div key={`${coin.id}-${i}`} className="flex items-center gap-3 text-sm font-medium">
            <div className="flex items-center gap-2">
              {coin.image && <img src={coin.image} alt={coin.symbol} className="w-5 h-5 rounded-full" />}
              <span className="text-text-secondary uppercase font-bold">{coin.symbol}</span>
            </div>
            <span className="text-white">${coin.current_price?.toLocaleString()}</span>
            <span className={`flex items-center ${coin.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {coin.price_change_percentage_24h >= 0
                ? <TrendingUp className="w-3 h-3 mr-1" />
                : <TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}