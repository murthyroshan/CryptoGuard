import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Activity, ArrowUpRight, ArrowDownRight, Shield, Bot, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, Legend } from 'recharts';
import { getMarketData } from '../services/api';
import { calculateRiskScore } from '../utils/risk';
import { AITradingSimModal } from '../components/AITradingSimModal';
import { useNavigate } from 'react-router-dom';
import { CryptoTicker } from '../components/CryptoTicker';

export function Dashboard() {
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [whaleAlerts, setWhaleAlerts] = useState([
    { amount: '1,420 BTC', from: 'Unknown', to: 'Binance', time: '2m ago', type: 'inflow' },
    { amount: '25M USDC', from: 'Circle', to: 'Unknown', time: '14m ago', type: 'mint' },
    { amount: '120,000 SOL', from: 'Unknown', to: 'Kraken', time: '45m ago', type: 'inflow' },
    { amount: '800 BTC', from: 'Gemini', to: 'Unknown', time: '1h ago', type: 'outflow' },
  ]);
  const [isSimOpen, setIsSimOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate live whale tracker feed every 10s
    const interval = setInterval(() => {
      const amounts = ['500 BTC', '1,200 ETH', '10M USDT', '45,000 SOL', '2M XRP'];
      const froms = ['Unknown', 'Binance', 'Coinbase', 'Kraken', 'KuCoin'];
      const tos = ['Unknown', 'Binance', 'Coinbase', 'Kraken', 'KuCoin'];
      const types = ['inflow', 'outflow', 'mint'];

      const rItem = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

      setWhaleAlerts(prev => {
        const newAlert = {
          amount: rItem(amounts),
          from: rItem(froms),
          to: rItem(tos),
          time: 'Just now',
          type: rItem(types)
        };
        // keep last 4
        return [newAlert, ...prev].slice(0, 4);
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);
        // Fetch top 10 coins for the heatmap
        const data = await getMarketData({ per_page: 10, sparkline: false });
        setMarketData(data);
      } catch (error) {
        console.error("Failed to fetch market data", error);
        setError("Could not load market data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Mock Risk Score Historical Trend Data
  const chartData = [
    { name: 'Day 1', value: 45 },
    { name: 'Day 2', value: 42 },
    { name: 'Day 3', value: 38 },
    { name: 'Day 4', value: 55 },
    { name: 'Day 5', value: 60 },
    { name: 'Day 6', value: 50 },
    { name: 'Day 7', value: 48 },
  ];

  const riskRadarData = [
    { subject: 'Volatility', value: 85, fullMark: 100 },
    { subject: 'Liquidity', value: 65, fullMark: 100 },
    { subject: 'Market Cap', value: 90, fullMark: 100 },
    { subject: 'Sentiment', value: 45, fullMark: 100 },
    { subject: 'Whale Activity', value: 70, fullMark: 100 },
  ];

  const portfolioPieData = [
    { name: 'BTC', value: 45, color: '#F7931A' },
    { name: 'ETH', value: 25, color: '#627EEA' },
    { name: 'SOL', value: 20, color: '#14F195' },
    { name: 'Others', value: 10, color: '#8C8C8C' },
  ];

  return (
    <div className="space-y-8">
      <CryptoTicker />

      <div>
        <h1 className="font-display font-bold text-3xl mb-2">Dashboard Overview</h1>
        <p className="text-text-secondary">Real-time risk intelligence and portfolio surveillance.</p>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Market Risk Index', value: '67', sub: 'Elevated', icon: Activity, color: 'text-orange-500', tooltip: 'Market Risk Index measures overall crypto market volatility based on price swings, liquidity, and whale activity.' },
          { label: 'Coins Tracked', value: '12,847', sub: '+124 today', icon: Shield, color: 'text-cyan-500', tooltip: 'Total number of cryptocurrencies currently monitored by CryptoGuard risk analysis systems.' },
          { label: 'Critical Alerts', value: '12', sub: 'High', icon: AlertTriangle, color: 'text-red-500', tooltip: 'High-risk market signals detected including whale activity, contract vulnerabilities, or liquidity risks.' },
          { label: 'Portfolio Health', value: 'B+', sub: 'Good', icon: ArrowUpRight, color: 'text-green-500', tooltip: 'An AI-calculated score measuring diversification, risk exposure, and asset balance.' },
        ].map((widget, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative group p-6 bg-bg-surface border border-border rounded-2xl hover:border-brand-purple/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-bg-elevated ${widget.color} bg-opacity-10`}>
                <widget.icon className={`w-6 h-6 ${widget.color}`} />
              </div>
              <span className={`text-xs font-mono px-2 py-1 rounded bg-bg-elevated ${widget.color}`}>{widget.sub}</span>
            </div>
            <h3 className="text-text-secondary text-sm font-medium mb-1">{widget.label}</h3>
            <p className="font-display font-bold text-2xl">{widget.value}</p>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-3 bg-bg-elevated text-text-secondary text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
              {widget.tooltip}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-bg-surface border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-lg">Systemic Risk Score Over Time</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 text-xs font-medium rounded-lg bg-orange-500 text-white">
                Last 7 Days
              </span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F2040', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(value: number) => [`${value}/100`, 'Risk Score']}
                />
                <Area type="monotone" dataKey="value" stroke="#F97316" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Whale Alerts */}
        <div className="bg-bg-surface border border-border rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Whale Alerts (Live Feed)
          </h3>
          <div className="space-y-4">
            {whaleAlerts.map((alert, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-bg-elevated/30 hover:bg-bg-elevated transition-colors cursor-pointer border border-transparent hover:border-border">
                <div className="mt-1">
                  {alert.type === 'inflow' ? (
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    <span className="text-brand-cyan">{alert.amount}</span> moved
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {alert.from} → {alert.to}
                  </p>
                  <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wide">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-bg-surface border border-border rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg mb-6">Market Risk Radar</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={riskRadarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Risk Metrics" dataKey="value" stroke="#F97316" fill="#F97316" fillOpacity={0.4} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F2040', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-bg-surface border border-border rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg mb-6">Portfolio Allocation Risk</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {portfolioPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F2040', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Risk Heatmap & Command Center */}
      <div className="bg-bg-surface border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-xl mb-2">Market Risk Heatmap</h1>
            <p className="text-text-secondary">Overview of your risk exposure and market conditions.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsSimOpen(true)}
              className="px-4 py-2 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 rounded-xl text-sm font-medium hover:bg-cyan-500/20 transition-colors flex items-center gap-2"
            >
              <Bot className="w-4 h-4" /> AI Sim
            </button>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
              <Shield className="w-4 h-4" /> Full Audit
            </button>
          </div>
        </div>
        <div className="mt-6 flow-root">
          <div className="-mx-6 -my-2 overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-white">Coin</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Price</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">24h Change</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Risk Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {loading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm"><div className="flex items-center gap-3"><div className="h-8 w-8 rounded-full bg-slate-700"></div><div className="h-4 w-20 bg-slate-700 rounded"></div></div></td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm"><div className="h-4 w-24 bg-slate-700 rounded"></div></td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm"><div className="h-4 w-16 bg-slate-700 rounded"></div></td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm"><div className="h-4 w-12 bg-slate-700 rounded"></div></td>
                      </tr>
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan={4} className="text-center py-10 text-red-500">{error}</td>
                    </tr>
                  ) : (
                    marketData.map((coin) => {
                      const risk = calculateRiskScore(coin).score;
                      const isPositive = (coin.price_change_percentage_24h || 0) >= 0;
                      return (
                        <tr key={coin.id} className="hover:bg-bg-elevated/30 cursor-pointer" onClick={() => navigate(`/scanner?q=${coin.id}`)}>
                          <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm">
                            <div className="flex items-center">
                              <div className="h-8 w-8 flex-shrink-0">
                                <img className="h-8 w-8 rounded-full" src={coin.image} alt="" />
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-white">{coin.name}</div>
                                <div className="text-text-muted">{coin.symbol.toUpperCase()}</div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-text-secondary font-mono">
                            ${(coin.current_price || 0).toLocaleString()}
                          </td>
                          <td className={`whitespace-nowrap px-3 py-4 text-sm font-mono ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {isPositive ? '+' : ''}{(coin.price_change_percentage_24h || 0).toFixed(2)}%
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${risk > 70 ? 'bg-red-500/10 text-red-400 ring-red-500/20' :
                              risk > 40 ? 'bg-orange-500/10 text-orange-400 ring-orange-500/20' :
                                'bg-green-500/10 text-green-400 ring-green-500/20'
                              }`}>
                              {risk}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <AITradingSimModal isOpen={isSimOpen} onClose={() => setIsSimOpen(false)} />
    </div>
  );
}
