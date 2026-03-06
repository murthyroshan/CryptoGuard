import React, { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Filter, Calendar, ChevronDown, X, Search } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const allAlerts = [
  { time: '2024-10-30 14:22', asset: 'BTC', type: 'Whale Movement', level: 'High', status: 'Flagged' },
  { time: '2024-10-30 11:05', asset: 'ETH', type: 'Contract Vulnerability', level: 'Critical', status: 'Investigating' },
  { time: '2024-10-29 18:45', asset: 'SOL', type: 'Market Anomaly', level: 'Medium', status: 'Resolved' },
  { time: '2024-10-29 09:12', asset: 'LINK', type: 'Liquidity Drain', level: 'High', status: 'Monitoring' },
  { time: '2024-10-28 22:30', asset: 'DOT', type: 'Network Congestion', level: 'Low', status: 'Closed' },
  { time: '2024-10-28 14:15', asset: 'AVAX', type: 'Large Selloff', level: 'Medium', status: 'Resolved' },
  { time: '2024-10-27 09:30', asset: 'MATIC', type: 'Bridge Hack', level: 'Critical', status: 'Investigating' },
  { time: '2024-10-26 16:20', asset: 'USDT', type: 'Depeg Warning', level: 'High', status: 'Monitoring' },
  { time: '2024-10-25 11:45', asset: 'DOGE', type: 'Social Spike', level: 'Low', status: 'Closed' },
  { time: '2024-10-24 08:10', asset: 'XRP', type: 'Legal Update', level: 'Medium', status: 'Resolved' },
];

export function Reports() {
  const [dateRange, setDateRange] = useState('30 Days');
  const [isRangeOpen, setIsRangeOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [chartData, setChartData] = useState<{ name: string, score: number }[]>([]);
  const [volData, setVolData] = useState<{ name: string, value: number }[]>([]);

  // History Modal State
  const [historyFilter, setHistoryFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const ranges = ['1 Day', '7 Days', '14 Days', '30 Days', '90 Days', '6 Months', '1 Year'];

  useEffect(() => {
    // Generate mock data based on selected range
    const generateData = () => {
      let points = 7;
      let labelFormat = 'MMM DD';
      let intervalType = 'day'; // 'day', 'week', 'month'
      let intervalStep = 1;

      switch (dateRange) {
        case '1 Day': points = 24; labelFormat = 'HH:00'; intervalType = 'hour'; break;
        case '7 Days': points = 7; labelFormat = 'ddd'; intervalType = 'day'; break;
        case '14 Days': points = 14; labelFormat = 'MMM DD'; intervalType = 'day'; break;
        case '30 Days': points = 15; labelFormat = 'MMM DD'; intervalType = 'day'; intervalStep = 2; break;
        case '90 Days': points = 12; labelFormat = 'MMM DD'; intervalType = 'week'; break;
        case '6 Months': points = 6; labelFormat = 'MMM'; intervalType = 'month'; break;
        case '1 Year': points = 12; labelFormat = 'MMM'; intervalType = 'month'; break;
        default: points = 7; intervalType = 'day';
      }

      const newRiskData = [];
      const newVolData = [];
      const now = new Date();

      for (let i = 0; i < points; i++) {
        const d = new Date(now);

        if (intervalType === 'hour') {
          d.setHours(now.getHours() - (points - 1 - i));
        } else if (intervalType === 'day') {
          d.setDate(now.getDate() - (points - 1 - i) * intervalStep);
        } else if (intervalType === 'week') {
          d.setDate(now.getDate() - (points - 1 - i) * 7);
        } else if (intervalType === 'month') {
          d.setMonth(now.getMonth() - (points - 1 - i));
        }

        let name = '';
        if (labelFormat === 'HH:00') {
          name = `${d.getHours()}:00`;
        } else if (labelFormat === 'ddd') {
          name = d.toLocaleDateString('en-US', { weekday: 'short' });
        } else if (labelFormat === 'MMM DD') {
          name = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else if (labelFormat === 'MMM') {
          name = d.toLocaleDateString('en-US', { month: 'short' });
        }

        // Randomize data slightly for visual effect
        const baseRisk = 40 + Math.random() * 30;
        const baseVol = 10 + Math.random() * 20;

        newRiskData.push({
          name,
          score: Math.round(baseRisk)
        });

        newVolData.push({
          name,
          value: Math.round(baseVol)
        });
      }
      setChartData(newRiskData);
      setVolData(newVolData);
    };

    generateData();
  }, [dateRange]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const dateStr = new Date().toISOString().split('T')[0];

    // Header
    doc.setFillColor(10, 22, 40);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('CryptoGuard Risk Report', 14, 25);
    doc.setFontSize(10);
    doc.text(`Generated: ${dateStr}`, 14, 35);

    // Summary Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Executive Summary', 14, 55);
    doc.setFontSize(11);
    doc.text(`Reporting Period: Last ${dateRange}`, 14, 65);
    doc.text('Overall Risk Score: 48.2 (Moderate)', 14, 72);
    doc.text('Total Alerts Detected: 1,284', 14, 79);

    // Alerts Table
    doc.setFontSize(16);
    doc.text('Critical Alerts Log', 14, 95);

    const tableData = allAlerts.map(a => [a.time, a.asset, a.type, a.level, a.status]);

    autoTable(doc, {
      startY: 100,
      head: [['Timestamp', 'Asset', 'Type', 'Risk Level', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [249, 115, 22] }, // Orange
    });

    doc.save(`CryptoGuard_Risk_Report_${dateStr}.pdf`);
  };

  const filteredAlerts = allAlerts.filter(alert => {
    const matchesAsset = alert.asset.toLowerCase().includes(historyFilter.toLowerCase()) ||
      alert.type.toLowerCase().includes(historyFilter.toLowerCase());
    const matchesRisk = riskFilter === 'All' || alert.level === riskFilter;
    return matchesAsset && matchesRisk;
  });

  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const paginatedAlerts = filteredAlerts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl mb-2">Risk Analytics Reports</h1>
          <p className="text-secondary">Comprehensive overview of historical security data and market exposure.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => setIsRangeOpen(!isRangeOpen)}
              className="px-4 py-2 bg-hover border border-border rounded-xl text-sm font-medium hover:bg-hover/80 transition-colors flex items-center gap-2 min-w-[140px] justify-between"
            >
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {dateRange}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {isRangeOpen && (
              <div className="absolute top-full mt-2 right-0 w-40 bg-hover border border-border rounded-xl shadow-xl z-20 overflow-hidden">
                {ranges.map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setDateRange(range);
                      setIsRangeOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors"
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> PDF Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Average Risk Score', value: '48.2', change: '+5.4%', color: 'text-orange-500' },
          { label: 'Total Alerts', value: '1,284', change: '-12%', color: 'text-white' },
          { label: 'Whale Activity', value: '42 High', change: '+2.1%', color: 'text-red-500' },
          { label: 'Compliance Rating', value: '98.5%', change: '+0.3%', color: 'text-green-500' },
        ].map((stat, idx) => (
          <div key={idx} className="p-6 bg-surface border border-border rounded-2xl">
            <p className="text-secondary text-sm font-medium mb-1">{stat.label}</p>
            <div className="flex items-end gap-3">
              <h2 className={`font-display font-bold text-3xl ${stat.color}`}>{stat.value}</h2>
              <span className={`text-xs font-bold mb-1 ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg mb-6">Risk Exposure Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F2040', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="score" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg mb-6">Asset Volatility Analytics</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volData}>
                <defs>
                  <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F2040', borderColor: '#1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#colorVol)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-lg flex items-center gap-2">
            Historical Alerts Log
          </h3>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="text-sm text-orange-500 hover:text-white transition-colors"
          >
            View Full History
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-muted uppercase tracking-wider border-b border-border">
                <th className="pb-3 font-medium">Timestamp</th>
                <th className="pb-3 font-medium">Asset</th>
                <th className="pb-3 font-medium">Alert Type</th>
                <th className="pb-3 font-medium">Risk Level</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {allAlerts.slice(0, 5).map((alert, idx) => (
                <tr key={idx} className="border-b border-border/50 hover:bg-hover/20 transition-colors">
                  <td className="py-4 text-secondary">{alert.time}</td>
                  <td className="py-4 font-bold">{alert.asset}</td>
                  <td className="py-4">{alert.type}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${alert.level === 'Critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                        alert.level === 'High' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                          alert.level === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                            'bg-green-500/10 text-green-500 border border-green-500/20'
                      }`}>
                      {alert.level}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-secondary italic">{alert.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Full History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-4xl relative max-h-[90vh] flex flex-col">
            <button onClick={() => setIsHistoryOpen(false)} className="absolute top-4 right-4 text-muted hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-xl mb-6">Full Alert History</h3>

            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search asset or alert type..."
                  value={historyFilter}
                  onChange={(e) => { setHistoryFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-hover border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
              <select
                value={riskFilter}
                onChange={(e) => { setRiskFilter(e.target.value); setCurrentPage(1); }}
                className="bg-hover border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500"
              >
                <option value="All">All Risks</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs text-muted uppercase tracking-wider border-b border-border sticky top-0 bg-surface">
                    <th className="pb-3 font-medium">Timestamp</th>
                    <th className="pb-3 font-medium">Asset</th>
                    <th className="pb-3 font-medium">Alert Type</th>
                    <th className="pb-3 font-medium">Risk Level</th>
                    <th className="pb-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {paginatedAlerts.map((alert, idx) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-hover/20 transition-colors">
                      <td className="py-4 text-secondary">{alert.time}</td>
                      <td className="py-4 font-bold">{alert.asset}</td>
                      <td className="py-4">{alert.type}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${alert.level === 'Critical' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                            alert.level === 'High' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' :
                              alert.level === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                                'bg-green-500/10 text-green-500 border border-green-500/20'
                          }`}>
                          {alert.level}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <span className="text-secondary italic">{alert.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="text-sm text-secondary hover:text-white disabled:opacity-50">Previous</button>
              <span className="text-sm text-secondary">Page {currentPage} of {totalPages || 1}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="text-sm text-secondary hover:text-white disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
