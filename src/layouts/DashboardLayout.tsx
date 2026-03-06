import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { NotificationPanel } from '../components/NotificationPanel';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { getMarketData } from '../services/api';

export function DashboardLayout() {
  const [searchTerm, setSearchTerm] = useState('');
  const [btcData, setBtcData] = useState<{ price: number, change: number }>({ price: 0, change: 0 });
  const [ethData, setEthData] = useState<{ price: number, change: number }>({ price: 0, change: 0 });
  const [panelOpen, setPanelOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const fearIndex = 72; // Mocking "Greed" index as requested by user

  useEffect(() => {
    getMarketData({ per_page: 5 }).then(data => {
      const btc = data.find((c: any) => c.symbol === 'btc');
      const eth = data.find((c: any) => c.symbol === 'eth');
      if (btc) setBtcData({ price: btc.current_price, change: btc.price_change_percentage_24h });
      if (eth) setEthData({ price: eth.current_price, change: eth.price_change_percentage_24h });
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/scanner?q=${searchTerm}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg-void text-text-primary pl-64">
      <Sidebar />

      {/* Top Bar */}
      <header
        className="h-16 sticky top-0 z-40 px-8 flex items-center justify-between"
        style={{
          background: 'rgba(4,10,22,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid transparent',
        }}
      >
        {/* Neon bottom border */}
        <div className="nav-neon-border absolute bottom-0 left-0 right-0 h-px" />
        {/* Dot-grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.07) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.4) 20%, rgba(0,0,0,0.4) 80%, transparent)',
          }}
        />

        {/* Market Widget */}
        <div className="hidden lg:flex items-center gap-5 relative z-10 border-r pr-6 mr-4" style={{ borderColor: 'rgba(124,58,237,0.15)' }}>
          {[
            { label: 'BTC', price: btcData.price, change: btcData.change },
            { label: 'ETH', price: ethData.price, change: ethData.change },
          ].map(({ label, price, change }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">{label}</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-white">${price.toLocaleString()}</span>
                <span className={`font-mono text-[10px] font-bold ${change >= 0 ? 'text-green-500' : 'text-red-400'}`}>
                  {change >= 0 ? '+' : ''}{change?.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
          <div className="cyber-badge text-[9px]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 status-dot" />
            Fear &amp; Greed: {fearIndex} — Greed
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative flex-1 max-w-md z-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="scan coin, contract or wallet..."
            className="cyber-input w-full py-2 pl-10 pr-4 text-sm rounded text-xs"
          />
        </form>

        {/* Right */}
        <div className="flex items-center gap-4 z-10">
          <button
            onClick={() => setPanelOpen((o) => !o)}
            className="relative p-2 transition-colors group"
            aria-label="Open notifications"
            style={{ color: panelOpen ? '#7C3AED' : '#475569' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#F1F5F9'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = panelOpen ? '#7C3AED' : '#475569'}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 text-white font-mono font-black text-[9px] rounded flex items-center justify-center status-dot"
                style={{ background: '#EF4444', boxShadow: '0 0 8px rgba(239,68,68,0.6)' }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Avatar */}
          <div
            className="w-8 h-8 rounded flex items-center justify-center font-mono text-xs font-black uppercase"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(6,182,212,0.3))',
              border: '1px solid rgba(124,58,237,0.5)',
              boxShadow: '0 0 12px rgba(124,58,237,0.3)',
            }}
          >
            {user?.name?.slice(0, 2) || 'CG'}
          </div>
        </div>
      </header>

      <main className="p-8">
        <Outlet />
      </main>

      {/* Notification Slide-In Panel */}
      <NotificationPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
    </div>
  );
}
