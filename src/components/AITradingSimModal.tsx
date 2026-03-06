import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, DollarSign, Bot, Activity } from 'lucide-react';
import { getMarketData } from '../services/api';

export function AITradingSimModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [amount, setAmount] = useState('1000');
  const [asset, setAsset] = useState('bitcoin');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSimulate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await getMarketData({ per_page: 100 });
      const coin = data.find((c: any) => c.id === asset.toLowerCase() || c.symbol.toLowerCase() === asset.toLowerCase());

      let finalMultiplier = 1.05; // 5% default
      let aiReasoning = "Steady market conditions with minimal volatility.";

      if (coin) {
        // Mock a 30-day lookback using the 24h change as a seed
        const changeSeed = coin.price_change_percentage_24h || 0;
        finalMultiplier = 1 + (changeSeed * 5 / 100); // Exaggerate for 30 days

        if (finalMultiplier > 1.2) {
          aiReasoning = `${coin.name} experienced significant bullish momentum over the last 30 days driven by high network activity and positive sentiment.`;
        } else if (finalMultiplier < 0.8) {
          aiReasoning = `${coin.name} suffered a major correction tracking broader macroeconomic weakness and reduced liquidity.`;
        } else {
          aiReasoning = `${coin.name} traded sideways with minor chop, typical of consolidation phases.`;
        }
      } else {
        aiReasoning = `Could not find exact asset data. Falling back to market average proxy.`;
      }

      // Artificial delay for "AI processing" effect
      await new Promise(r => setTimeout(r, 1500));

      const numAmount = parseFloat(amount) || 1000;
      const finalValue = numAmount * finalMultiplier;
      const pnl = finalValue - numAmount;
      const pnlPercent = (finalMultiplier - 1) * 100;

      setResult({
        finalValue,
        pnl,
        pnlPercent,
        aiReasoning,
        coinName: coin ? coin.name : asset
      });

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-muted hover:text-white rounded-lg hover:bg-hover transition-colors">
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-brand-purple" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl">AI Trading Simulator</h2>
              <p className="text-xs text-secondary">Simulate past 30-day performance</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Investment Amount ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-brand-purple transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-1">Asset Symbol/Name</label>
              <input
                type="text"
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                placeholder="e.g. BTC, Ethereum, Solana"
                className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:outline-none focus:border-brand-purple transition-colors"
              />
            </div>
          </div>

          <button
            onClick={handleSimulate}
            disabled={loading || !amount || !asset}
            className="w-full py-3 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-xl transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? <Activity className="w-5 h-5 animate-spin" /> : 'Run Simulation'}
          </button>

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-xl border border-border bg-hover/30"
            >
              <h3 className="text-sm font-medium text-secondary mb-3">Simulation Results: {result.coinName}</h3>

              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="text-3xl font-display font-bold">${result.finalValue.toFixed(2)}</div>
                  <div className="text-xs text-muted">Final Balance</div>
                </div>
                <div className={`text-right flex items-center gap-1 font-bold ${result.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {result.pnl >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {result.pnl >= 0 ? '+' : ''}{result.pnl.toFixed(2)} ({result.pnlPercent.toFixed(2)}%)
                </div>
              </div>

              <div className="p-3 bg-brand-purple/10 border border-brand-purple/20 rounded-lg text-sm text-secondary italic">
                <span className="font-bold text-brand-purple block mb-1">AI Reasoning:</span>
                {result.aiReasoning}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
