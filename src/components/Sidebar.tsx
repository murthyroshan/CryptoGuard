import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, Briefcase, FileText, Bot, LogOut, Shield, GraduationCap } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Search, label: 'Coin Scanner', path: '/scanner' },
  { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Bot, label: 'AI Assistant', path: '/assistant' },
  { icon: GraduationCap, label: 'Learning Hub', path: '/learning' },
];

function InteractiveCyberLogo() {
  const target1 = "Crypto";
  const target2 = "Guard";
  const [text1, setText1] = useState(target1);
  const [text2, setText2] = useState(target2);
  const [isHovered, setIsHovered] = useState(false);

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>";

  useEffect(() => {
    if (!isHovered) {
      setText1(target1);
      setText2(target2);
      return;
    }

    let iteration = 0;
    const maxLen = Math.max(target1.length, target2.length);
    let intervalId: ReturnType<typeof setInterval>;

    const animate = () => {
      setText1(
        target1.split('').map((char, i) => {
          if (i < iteration) return target1[i];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );

      setText2(
        target2.split('').map((char, i) => {
          if (i < iteration) return target2[i];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );

      if (iteration >= maxLen) {
        clearInterval(intervalId);
      }
      iteration += 1 / 3;
    };

    intervalId = setInterval(animate, 30);
    return () => clearInterval(intervalId);
  }, [isHovered]);

  return (
    <Link
      to="/dashboard"
      className="relative flex items-center gap-4 px-6 py-6 group cursor-pointer overflow-hidden border-b border-border transition-colors duration-500 hover:border-brand-cyan/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ textDecoration: 'none' }}
    >
      {/* Background Hover Sweep */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-brand-cyan/10 to-transparent transition-transform duration-500 ease-out pointer-events-none"
        style={{ transform: isHovered ? 'translateX(0%)' : 'translateX(-100%)' }}
      />

      {/* Abstract Geo Icon */}
      <div className="relative w-10 h-10 flex flex-col items-center justify-center shrink-0" style={{ perspective: '1000px' }}>
        {/* Outer Dashed Ring */}
        <div
          className="absolute inset-0 rounded-full border border-dashed transition-colors duration-500"
          style={{
            borderColor: isHovered ? '#06B6D4' : 'rgba(148, 163, 184, 0.3)',
            animation: isHovered ? 'spin 4s linear infinite' : 'spin 12s linear infinite'
          }}
        />

        {/* Inner Tracking Ring */}
        <div
          className="absolute inset-1.5 rounded-full border transition-all duration-500 z-10"
          style={{
            borderColor: isHovered ? '#7C3AED' : 'rgba(124, 58, 237, 0.3)',
            transform: isHovered ? 'scale(1.1) rotateX(180deg)' : 'scale(0.8) rotateX(0deg)',
            boxShadow: isHovered ? 'inset 0 0 10px rgba(124, 58, 237, 0.5)' : 'none',
            animation: isHovered ? 'spin 3s linear reverse infinite' : 'none'
          }}
        />

        {/* Core Diamond */}
        <div
          className="w-2.5 h-2.5 rounded-[2px] z-20 transition-all duration-500"
          style={{
            transform: isHovered ? 'rotate(135deg) scale(1.3)' : 'rotate(45deg) scale(1)',
            backgroundColor: isHovered ? '#06B6D4' : '#7C3AED',
            boxShadow: isHovered ? '0 0 15px #06B6D4' : '0 0 0px transparent'
          }}
        />
      </div>

      {/* Decrypting Text Area */}
      <div className="flex flex-col select-none relative z-10 mt-0.5">
        <div className="flex text-[22px] font-display font-black tracking-tight leading-none mb-1">
          <span className="text-white transition-colors duration-300">
            {text1}
          </span>
          <span
            className="transition-colors duration-300"
            style={{ color: isHovered ? '#06B6D4' : '#7C3AED' }}
          >
            {text2}
          </span>
        </div>

        {/* Subtitle mask for slide effect */}
        <div className="h-[14px] overflow-hidden relative w-full">
          <div
            className="absolute top-0 left-0 w-full flex flex-col transition-transform duration-300 ease-out"
            style={{ transform: isHovered ? 'translateY(-14px)' : 'translateY(0)' }}
          >
            <span className="h-[14px] flex items-center text-[10px] text-text-muted font-mono tracking-[0.2em] uppercase">
              Security Suite
            </span>
            <span className="h-[14px] flex items-center text-[10px] text-brand-cyan font-mono tracking-[0.2em] uppercase">
              <span className="w-1.5 h-1.5 bg-brand-cyan rounded-full mr-1.5 animate-pulse shadow-[0_0_6px_#06B6D4]" />
              System Active
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      className="w-64 h-screen fixed left-0 top-0 flex flex-col z-50 border-r"
      style={{
        background: 'rgba(4,10,22,0.97)',
        borderColor: 'rgba(124,58,237,0.15)',
      }}
    >
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.10) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Interactive Cyber Logo */}
      <div className="relative z-10">
        <InteractiveCyberLogo />
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 relative z-10">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex items-center gap-3 px-4 py-3 transition-all duration-200 group"
              style={{
                color: isActive ? '#06B6D4' : '#475569',
                background: isActive ? 'rgba(6,182,212,0.06)' : 'transparent',
                borderLeft: isActive ? '2px solid #06B6D4' : '2px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.color = '#F1F5F9';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.color = '#475569';
              }}
            >
              {/* Active LED */}
              {isActive && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-cyan status-dot" />
              )}
              {/* Bracket corners on hover */}
              <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-brand-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <span className="absolute bottom-0 right-6 w-2.5 h-2.5 border-b border-r border-brand-purple opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              <item.icon
                className="w-4 h-4 flex-shrink-0 transition-colors duration-200"
                style={{ color: isActive ? '#06B6D4' : 'inherit' }}
              />
              <span className="font-mono text-[13px] font-semibold tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 relative z-10" style={{ borderTop: '1px solid rgba(124,58,237,0.12)' }}>
        <button
          onClick={handleLogout}
          className="relative flex items-center gap-3 px-4 py-3 w-full transition-all duration-200 group"
          style={{ color: '#475569', borderLeft: '2px solid transparent' }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = '#F87171';
            el.style.background = 'rgba(239,68,68,0.06)';
            el.style.borderLeftColor = '#EF4444';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = '#475569';
            el.style.background = 'transparent';
            el.style.borderLeftColor = 'transparent';
          }}
        >
          <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="font-mono text-[13px] font-semibold tracking-wide">Logout</span>
        </button>

        {/* System status chip */}
        <div className="mt-3 px-4">
          <div className="cyber-badge w-full justify-center text-[9px]">
            <span className="w-1 h-1 rounded-full bg-green-500 status-dot" />
            Secure Session Active
          </div>
        </div>
      </div>
    </aside>
  );
}

