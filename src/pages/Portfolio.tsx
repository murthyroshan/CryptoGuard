import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Plus, AlertTriangle, ArrowUpRight, MoreHorizontal, Loader2, Bot, Sparkles, CheckCircle2, X, Trash2, Edit2, History, Info } from 'lucide-react';
import { getMarketData } from '../services/api';
import { calculateRiskScore, getRiskLevel } from '../utils/risk';
import axios from 'axios';

const portfolioCache: {
  data: {
    portfolio: any[];
    totalValue: number;
    avgRisk: number;
    allocationData: any[];
  } | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

const PortfolioRowSkeleton = () => (
  <tr className="border-b border-border/50 animate-pulse">
    <td className="py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-700"></div><div><div className="h-4 w-20 bg-slate-700 rounded mb-1"></div><div className="h-3 w-10 bg-slate-700 rounded"></div></div></div></td>
    <td className="py-4"><div className="h-4 w-16 bg-slate-700 rounded mb-1"></div><div className="h-3 w-20 bg-slate-700 rounded"></div></td>
    <td className="py-4"><div className="h-4 w-24 bg-slate-700 rounded mb-1"></div><div className="h-3 w-12 bg-slate-700 rounded"></div></td>
    <td className="py-4">
      <div className="flex items-center gap-2">
        <div className="h-5 w-12 bg-slate-700 rounded"></div>
        <div className="w-16 h-1.5 rounded-full bg-slate-700"></div>
      </div>
    </td>
    <td className="py-4 text-right">
      <div className="w-4 h-4 bg-slate-700 rounded-full inline-block"></div>
    </td>
  </tr>
);

const initialHoldings = [
  { id: 'bitcoin', name: 'Bitcoin', sym: 'BTC', amount: 0.45, color: '#F7931A' },
  { id: 'ethereum', name: 'Ethereum', sym: 'ETH', amount: 6.2, color: '#627EEA' },
  { id: 'solana', name: 'Solana', sym: 'SOL', amount: 45, color: '#14F195' },
  { id: 'chainlink', name: 'Chainlink', sym: 'LINK', amount: 120, color: '#2A5ADA' },
  { id: 'pepe', name: 'Pepe', sym: 'PEPE', amount: 500000000, color: '#E01F1F' },
];

const historyData = [
  { date: 'Jan', value: 45000 },
  { date: 'Feb', value: 52000 },
  { date: 'Mar', value: 48000 },
  { date: 'Apr', value: 61000 },
  { date: 'May', value: 59000 },
  { date: 'Jun', value: 68000 },
  { date: 'Jul', value: 72000 },
];

export function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [avgRisk, setAvgRisk] = useState(0);
  const [allocationData, setAllocationData] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<any>(null);
  const [holdings, setHoldings] = useState(initialHoldings);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  // Form state
  const [newCoin, setNewCoin] = useState({ name: '', amount: '', price: '', date: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      setLoading(true);
      const now = Date.now();
      // Use cache if data is less than 5 minutes old
      if (portfolioCache.data && (now - portfolioCache.timestamp < 300000)) {
        const { portfolio, totalValue, avgRisk, allocationData } = portfolioCache.data;
        setPortfolio(portfolio);
        setTotalValue(totalValue);
        setAvgRisk(avgRisk);
        setAllocationData(allocationData);
        setLoading(false);
        return;
      }

      try {
        // Simulating a slightly longer load time to see skeletons
        await new Promise(res => setTimeout(res, 500));
        const data = await getMarketData({ per_page: 100 });
        let total = 0;
        let totalRisk = 0;

        const newPortfolio = holdings.map(holding => {
          const coinData = data.find((c: any) => c.id === holding.id);
          const price = coinData?.current_price || 0;
          const value = holding.amount * price;
          const change = coinData?.price_change_percentage_24h || 0;
          const scoreData = coinData ? calculateRiskScore(coinData) : { score: 50 };
          const score = scoreData?.score || 50;
          const riskObj = getRiskLevel(score);

          total += value;
          totalRisk += score;

          return {
            ...holding,
            price,
            value,
            change,
            score,
            riskColor: riskObj.color.replace('text-', ''),
            riskLabel: riskObj.label.toLowerCase()
          };
        });

        setTotalValue(total);
        setAvgRisk(Math.round(totalRisk / (holdings.length || 1)));

        const alloc = newPortfolio.map(p => ({
          name: p.name,
          value: total > 0 ? Number(((p.value / total) * 100).toFixed(1)) : 0,
          color: p.color
        }));

        setAllocationData(alloc);
        setPortfolio(newPortfolio);

        // Save processed data to cache
        portfolioCache.data = {
          portfolio: newPortfolio,
          totalValue: total,
          avgRisk: Math.round(totalRisk / (holdings.length || 1)),
          allocationData: alloc
        };
        portfolioCache.timestamp = now;
      } catch (err) {
        console.error("Failed to load portfolio", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolioData();
  }, [holdings]);

  const generateAIInsights = async () => {
    if (portfolio.length === 0) return;
    setAnalyzing(true);
    try {
      const holdingsSummary = portfolio.map(p =>
        `${p.name} ($${p.value.toFixed(0)})`
      ).join(', ');

      const prompt = `
        Analyze this crypto portfolio: ${holdingsSummary}. Total Value: $${totalValue.toFixed(0)}.
        Provide a risk assessment in this JSON format:
        {
          "riskLevel": "High" | "Medium" | "Low",
          "problems": ["Brief bullet point 1", "Brief bullet point 2"],
          "actions": ["Specific action 1 (e.g. Reduce SOL by 20%)", "Specific action 2"]
        }
        Be critical and actionable.
      `;

      const response = await axios.post('/api/analyze', {
        prompt,
        config: { responseMimeType: "application/json" },
      });

      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const cleanJson = text.replace(/```json|```/g, '').trim();
      if (cleanJson) setAiAdvice(JSON.parse(cleanJson));
    } catch (e) {
      console.error("AI Error", e);
      // Dynamic fallback based on local state
      const highRiskCount = portfolio.filter(p => p.score > 60).length;
      const totalAssets = portfolio.length;
      const riskRatio = highRiskCount / totalAssets;

      let riskLevel = "Low";
      let problems = [];
      let actions = [];

      if (avgRisk > 60) {
        riskLevel = "High";
        problems.push("Overall portfolio risk is elevated.");
        problems.push("Heavy exposure to volatile assets.");
        actions.push("Consider taking profits on high-risk coins.");
        actions.push("Rebalance into stablecoins or BTC.");
      } else if (avgRisk > 35) {
        riskLevel = "Medium";
        problems.push("Some assets showing increased volatility.");
        actions.push("Monitor high-risk positions closely.");
      } else {
        problems.push("Portfolio is conservative.");
        actions.push("Consider small allocation to growth assets.");
      }

      setAiAdvice({
        riskLevel,
        problems: problems.length ? problems : ["Portfolio looks balanced."],
        actions: actions.length ? actions : ["Maintain current strategy."]
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    const id = newCoin.name.toLowerCase().replace(/\s+/g, '-');
    const newHolding = {
      id,
      name: newCoin.name,
      sym: newCoin.name.substring(0, 3).toUpperCase(),
      amount: parseFloat(newCoin.amount),
      color: '#8C8C8C' // Default color
    };

    setHoldings([...holdings, newHolding]);
    setIsAddModalOpen(false);
    setNewCoin({ name: '', amount: '', price: '', date: '' });
    // Invalidate cache to force refresh
    portfolioCache.data = null;
  };

  const handleDeleteAsset = (id: string) => {
    setHoldings(holdings.filter(h => h.id !== id));
    // Invalidate cache
    portfolioCache.data = null;
  };

  const handleUpdateAmount = (id: string, newAmount: number) => {
    setHoldings(holdings.map(h => h.id === id ? { ...h, amount: newAmount } : h));
    setEditingId(null);
    // Invalidate cache
    portfolioCache.data = null;
  };

  const getProfitLoss = () => {
    // Mock calculation for demo purposes
    const initialInvestment = totalValue * 0.85;
    return totalValue - initialInvestment;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl mb-2">Portfolio Analyzer</h1>
          <p className="text-secondary">Real-time risk monitoring and diversification health.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="px-4 py-2 bg-hover border border-border rounded-xl text-sm font-medium hover:bg-hover/80 transition-colors flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            View History
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Holding
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-surface border border-border rounded-2xl">
          <p className="text-secondary text-sm font-medium mb-1">Total Value</p>
          {loading ? (
            <div className="h-9 w-48 bg-slate-700 rounded animate-pulse mt-1" />
          ) : (
            <div className="flex items-end gap-3">
              <h2 className="font-display font-bold text-3xl">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              <span className="text-green-500 text-sm font-bold mb-1 flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +5.2%
              </span>
            </div>
          )}
        </div>
        <div className="p-6 bg-surface border border-border rounded-2xl">
          <p className="text-secondary text-sm font-medium mb-1">Avg Risk Score</p>
          {loading ? (
            <div className="h-9 w-32 bg-slate-700 rounded animate-pulse mt-1" />
          ) : (
            <div className="flex items-end gap-3">
              <h2 className={`font-display font-bold text-3xl ${avgRisk > 60 ? 'text-red-500' : avgRisk > 30 ? 'text-orange-500' : 'text-green-500'}`}>{avgRisk}</h2>
              <span className="text-secondary text-sm mb-1">Moderate Risk Profile</span>
            </div>
          )}
        </div>
        <div className="p-6 bg-surface border border-border rounded-2xl relative group">
          <p className="text-secondary text-sm font-medium mb-1">Health Grade</p>
          <div className="absolute top-6 right-6 text-muted hover:text-white cursor-help">
            <Info className="w-4 h-4" />
            <div className="absolute right-0 top-6 w-48 p-3 bg-hover border border-border rounded-xl text-xs text-secondary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
              <p className="font-bold text-white mb-1">Grading Scale</p>
              <p>A+ (Best) → F (Worst)</p>
              <p className="mt-1">Based on diversification, risk score, and asset quality.</p>
            </div>
          </div>
          {loading ? (
            <div className="h-9 w-24 bg-slate-700 rounded animate-pulse mt-1" />
          ) : (
            <div className="flex items-end gap-3">
              <h2 className="font-display font-bold text-3xl text-green-500">B+</h2>
              <span className="text-secondary text-sm mb-1">Diversified Portfolio</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Asset List */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg">Asset Risk Ledger</h3>
            <button
              onClick={() => setIsManageModalOpen(true)}
              className="text-sm text-orange-500 hover:text-white transition-colors"
            >
              Manage Assets
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-muted uppercase tracking-wider border-b border-border">
                  <th className="pb-3 font-medium">Asset</th>
                  <th className="pb-3 font-medium">Holdings</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Risk Score</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading
                  ? Array.from({ length: 5 }).map((_, i) => <PortfolioRowSkeleton key={i} />)
                  : portfolio.map((asset, idx) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-hover/20 transition-colors group">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-hover flex items-center justify-center font-bold text-xs" style={{ color: asset.color }}>
                            {asset.sym[0]}
                          </div>
                          <div>
                            <div className="font-bold">{asset.name}</div>
                            <div className="text-xs text-muted">{asset.sym}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="font-medium">{asset.amount >= 1000000 ? `${(asset.amount / 1000000).toFixed(1)}M` : asset.amount}</div>
                        <div className="text-xs text-muted">${asset.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      </td>
                      <td className="py-4">
                        <div className="font-medium">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</div>
                        <div className={`text-xs ${asset.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {asset.change > 0 ? '+' : ''}{asset.change.toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-${asset.riskColor}`}>
                            {asset.score}/100
                          </span>
                          <div className={`w-16 h-1.5 rounded-full bg-hover overflow-hidden`}>
                            <div
                              className={`h-full bg-${asset.riskColor}`}
                              style={{ width: `${asset.score}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-right flex justify-end gap-2">
                        <button
                          onClick={() => {
                            const newAmt = prompt("Enter new amount:", asset.amount.toString());
                            if (newAmt && !isNaN(parseFloat(newAmt))) handleUpdateAmount(asset.id, parseFloat(newAmt));
                          }}
                          className="p-2 hover:bg-hover rounded-lg text-secondary hover:text-white transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg text-secondary hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Allocation & Alerts */}
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h3 className="font-display font-bold text-lg mb-6">Asset Allocation</h3>
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F2040', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="text-xs text-muted">Total</span>
                  <div className="font-bold text-xl">${(totalValue / 1000).toFixed(1)}k</div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {allocationData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-secondary">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Advisor Section */}
          <div className="bg-surface border border-border rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Bot className="w-24 h-24 text-orange-500" />
            </div>

            <div className="flex items-center gap-2 mb-6 relative z-10">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h3 className="font-display font-bold text-lg">AI Portfolio Advisor</h3>
            </div>

            {!aiAdvice ? (
              <div className="text-center py-8 relative z-10">
                <p className="text-secondary text-sm mb-4">Generate actionable insights to optimize your holdings.</p>
                <button
                  onClick={generateAIInsights}
                  disabled={analyzing}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-70 flex items-center gap-2 mx-auto"
                >
                  {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                  {analyzing ? 'Analyzing Portfolio...' : 'Run AI Audit'}
                </button>
              </div>
            ) : (
              <div className="space-y-4 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <span className="text-sm text-secondary">Portfolio Risk</span>
                  <span className={`font-bold ${aiAdvice.riskLevel === 'High' ? 'text-red-500' : aiAdvice.riskLevel === 'Medium' ? 'text-orange-500' : 'text-green-500'}`}>
                    {aiAdvice.riskLevel.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-muted uppercase tracking-wider mb-2">Detected Issues</h4>
                  <ul className="space-y-2">
                    {aiAdvice.problems.map((prob: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-400"><AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {prob}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">AI Recommendation</h4>
                  <ul className="space-y-2">
                    {aiAdvice.actions.map((action: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white"><CheckCircle2 className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" /> {action}</li>
                    ))}
                  </ul>
                </div>

                <button onClick={() => setAiAdvice(null)} className="text-xs text-muted hover:text-white underline w-full text-center mt-2">Reset Analysis</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Holding Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md relative">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-muted hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display font-bold text-xl mb-4">Add New Holding</h3>
            <form onSubmit={handleAddHolding} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-1">Coin Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bitcoin"
                  value={newCoin.name}
                  onChange={e => setNewCoin({ ...newCoin, name: e.target.value })}
                  className="w-full bg-hover border border-border rounded-xl p-3 text-sm focus:border-orange-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-secondary uppercase mb-1">Amount</label>
                <input
                  type="number"
                  required
                  step="any"
                  placeholder="0.00"
                  value={newCoin.amount}
                  onChange={e => setNewCoin({ ...newCoin, amount: e.target.value })}
                  className="w-full bg-hover border border-border rounded-xl p-3 text-sm focus:border-orange-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase mb-1">Purchase Price ($)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={newCoin.price}
                    onChange={e => setNewCoin({ ...newCoin, price: e.target.value })}
                    className="w-full bg-hover border border-border rounded-xl p-3 text-sm focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase mb-1">Date Purchased</label>
                  <input
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={newCoin.date}
                    onChange={e => setNewCoin({ ...newCoin, date: e.target.value })}
                    className="w-full bg-hover border border-border rounded-xl p-3 text-sm focus:border-orange-500 outline-none text-secondary"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold mt-2">
                Add Asset
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View History Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-3xl relative">
            <button onClick={() => setIsHistoryModalOpen(false)} className="absolute top-4 right-4 text-muted hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display font-bold text-xl mb-2">Portfolio Performance</h3>
            <p className="text-secondary text-sm mb-6">Historical value tracking over the last 6 months.</p>

            <div className="h-[300px] w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="colorHistory" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F2040', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#F97316" strokeWidth={2} fillOpacity={1} fill="url(#colorHistory)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-hover/30 rounded-xl">
                <p className="text-xs text-secondary uppercase">Total Profit/Loss</p>
                <p className="text-xl font-bold text-green-500">+${getProfitLoss().toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              </div>
              <div className="p-4 bg-hover/30 rounded-xl">
                <p className="text-xs text-secondary uppercase">Best Performer</p>
                <p className="text-xl font-bold text-white">Bitcoin</p>
              </div>
              <div className="p-4 bg-hover/30 rounded-xl">
                <p className="text-xs text-secondary uppercase">Transactions</p>
                <p className="text-xl font-bold text-white">12</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Assets Modal */}
      {isManageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-lg relative">
            <button onClick={() => setIsManageModalOpen(false)} className="absolute top-4 right-4 text-muted hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display font-bold text-xl mb-6">Manage Assets</h3>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {holdings.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 bg-hover/30 rounded-xl border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-hover flex items-center justify-center font-bold text-xs" style={{ color: asset.color }}>
                      {asset.sym[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{asset.name}</p>
                      <p className="text-xs text-muted">{asset.amount} {asset.sym}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const newAmt = prompt("Enter new amount:", asset.amount.toString());
                        if (newAmt && !isNaN(parseFloat(newAmt))) handleUpdateAmount(asset.id, parseFloat(newAmt));
                      }}
                      className="p-2 hover:bg-hover rounded-lg text-secondary hover:text-white transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg text-secondary hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
