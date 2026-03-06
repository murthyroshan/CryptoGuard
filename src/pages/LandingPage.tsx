import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Activity, Lock, BarChart3, TrendingUp, Github, Twitter, MessageCircle, Search, Brain, ShieldCheck, Send, Bitcoin, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CryptoTicker } from '../components/CryptoTicker';
import { ParticleBackground } from '../components/ParticleBackground';

const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
];

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';

function useScramble(text: string, trigger: boolean) {
  const [display, setDisplay] = React.useState(text);
  React.useEffect(() => {
    if (!trigger) { setDisplay(text); return; }
    let i = 0;
    const id = setInterval(() => {
      setDisplay(text.split('').map((c, idx) =>
        idx < i ? text[idx] : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join(''));
      if (i++ >= text.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [trigger, text]);
  return display;
}

function CyberNavLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  const [hovered, setHovered] = React.useState(false);
  const display = useScramble(label, hovered);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative px-5 py-2 font-mono text-[13px] font-semibold tracking-widest uppercase transition-all duration-200 select-none"
      style={{ color: active ? '#06B6D4' : hovered ? '#F1F5F9' : '#475569' }}
    >
      {/* Active LED dot */}
      {active && (
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-cyan status-dot" />
      )}
      {/* Hover bracket corners */}
      {hovered && <>
        <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-brand-cyan" />
        <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-brand-cyan" />
        <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-brand-cyan" />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-brand-cyan" />
      </>}
      {display}
    </a>
  );
}

function CyberNav({ scrolled, activeSection, navigate, isAuthenticated }: {
  scrolled: boolean;
  activeSection: string;
  navigate: (path: string) => void;
  isAuthenticated: boolean;
}) {
  const [logoHovered, setLogoHovered] = React.useState(false);
  const logoDisplay = useScramble('CryptoGuard', logoHovered);

  const isActive = (href: string) =>
    href === '#' ? activeSection === '' : activeSection === href.slice(1);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Main bar */}
      <div
        className="relative w-full transition-all duration-500"
        style={{
          background: scrolled
            ? 'rgba(2,6,23,0.92)'
            : 'rgba(2,6,23,0.6)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Subtle dot-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 0,
            backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.18) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0.5) 80%, transparent)',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-8 flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-3 group cursor-pointer"
            style={{ textDecoration: 'none' }}
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            {/* Shield icon */}
            <div
              className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
              style={{
                background: logoHovered
                  ? 'linear-gradient(135deg,#7C3AED,#06B6D4)'
                  : 'rgba(124,58,237,0.2)',
                border: '1px solid rgba(124,58,237,0.5)',
                boxShadow: logoHovered ? '0 0 20px rgba(124,58,237,0.6)' : '0 0 6px rgba(124,58,237,0.2)',
                transform: logoHovered ? 'rotate(-8deg) scale(1.1)' : 'rotate(0) scale(1)',
              }}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>

            {/* Wordmark */}
            <div className="flex flex-col leading-none">
              <span
                className="font-mono font-black text-lg tracking-tight transition-all duration-200"
                style={{
                  color: logoHovered ? '#06B6D4' : '#F1F5F9',
                  textShadow: logoHovered ? '0 0 12px rgba(6,182,212,0.6)' : 'none',
                  letterSpacing: logoHovered ? '0.08em' : '0.02em',
                }}
              >
                {logoDisplay}
              </span>
              {/* Status badge */}
              <span className="flex items-center gap-1 text-[9px] font-mono tracking-[0.18em] uppercase text-text-muted mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 status-dot" />
                {logoHovered ? 'system active' : 'security suite'}
              </span>
            </div>
          </Link>

          {/* ── Nav Links ── */}
          <div className="hidden md:flex items-center">
            {NAV_LINKS.map((link) => (
              <CyberNavLink
                key={link.label}
                label={link.label}
                href={link.href}
                active={isActive(link.href)}
              />
            ))}
          </div>

          {/* ── Right ── */}
          <div className="flex items-center gap-4">
            {/* System info chip */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-green-500/20 bg-green-500/5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 status-dot" />
              <span className="font-mono text-[10px] text-green-500 uppercase tracking-widest">All Systems Normal</span>
            </div>

            {/* Log In — holographic button */}
            <Link
              to="/auth"
              className="holo-btn relative flex items-center gap-2 px-5 py-2.5 font-mono text-sm font-bold tracking-widest uppercase overflow-hidden transition-all duration-300"
              style={{
                color: '#F1F5F9',
                background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))',
                border: '1px solid rgba(124,58,237,0.5)',
                borderRadius: '4px',
                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.35), rgba(6,182,212,0.25))';
                el.style.boxShadow = '0 0 24px rgba(124,58,237,0.5), 0 0 8px rgba(6,182,212,0.3)';
                el.style.borderColor = '#7C3AED';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))';
                el.style.boxShadow = 'none';
                el.style.borderColor = 'rgba(124,58,237,0.5)';
              }}
            >
              <span className="relative z-10">Log In</span>
              <ArrowRight className="w-3.5 h-3.5 relative z-10" />
            </Link>
          </div>
        </div>

        {/* Animated neon bottom border */}
        <div className="h-px w-full nav-neon-border" />
      </div>

      {/* Corner brackets on the bar */}
      <div className="absolute bottom-0 left-4 w-3 h-3 border-b border-l border-brand-cyan nav-corner" />
      <div className="absolute bottom-0 right-4 w-3 h-3 border-b border-r border-brand-purple nav-corner" />
    </div>
  );
}

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Detect scroll to activate glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: highlight active section, reset to Home when near top
  useEffect(() => {
    const sections = ['features', 'how-it-works'];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { threshold: 0.3 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Reset to Home when user scrolls back near the top
    const onScroll = () => { if (window.scrollY < 300) setActiveSection(''); };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleAppClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    navigate(isAuthenticated ? path : '/auth');
  };

  const isLinkActive = (href: string) => {
    if (href === '#') return activeSection === '';
    return activeSection === href.slice(1);
  };

  return (
    <div className="min-h-screen bg-bg-void text-text-primary font-sans relative overflow-x-hidden">
      {/* Background Mesh + Full-page particles */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-cyan/20 rounded-full blur-[120px]" />
        <ParticleBackground />
      </div>

      {/* ── CYBERPUNK NAVBAR ─────────────────────────────── */}
      <CyberNav scrolled={scrolled} activeSection={activeSection} navigate={navigate} isAuthenticated={isAuthenticated} />

      {/* Spacer so hero doesn't hide under fixed nav */}
      <div className="h-20" />

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6 text-center">
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="cyber-badge mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan status-dot" />
              AI Powered Risk Intelligence // v2.1.0
            </div>

            <h1 className="cyber-section-title text-5xl md:text-7xl leading-[1.1] tracking-tight mb-6 font-extrabold">
              Understand Crypto Risk
              <br className="hidden md:block" />
              Before You Invest
            </h1>

            <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed font-mono">
              <span className="text-brand-cyan">&gt;</span> AI risk intelligence platform analyzing volatility,<br />
              <span className="text-brand-cyan">&gt;</span> whale movements and smart contract threats.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/scanner"
                onClick={(e) => handleAppClick(e, '/scanner')}
                className="cyber-btn text-base w-full sm:w-auto justify-center"
                style={{ clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)', padding: '14px 32px' }}
              >
                Scan Token <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/learning"
                onClick={(e) => handleAppClick(e, '/learning')}
                className="relative flex items-center justify-center gap-2 w-full sm:w-auto font-mono font-bold text-sm uppercase tracking-widest px-8 py-4 border border-white/10 hover:border-brand-cyan/40 text-text-secondary hover:text-white transition-all"
                style={{ clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' }}
              >
                Learning Hub
              </Link>
            </div>

            {/* 3 Key Metrics Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {[
                { icon: Shield, label: 'AI Risk Scanner', desc: 'Volatility, liquidity & smart contract vulnerabilities.', color: '#7C3AED' },
                { icon: Activity, label: 'Whale Tracker', desc: 'Large wallet movements across exchanges in real time.', color: '#06B6D4' },
                { icon: TrendingUp, label: 'Portfolio Intel', desc: 'Diversification, exposure and portfolio health score.', color: '#10B981' },
              ].map((item, i) => (
                <div key={i} className="cyber-card rounded p-4 flex items-center gap-4 text-left">
                  <div
                    className="w-11 h-11 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}18`, border: `1px solid ${item.color}40` }}
                  >
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="font-mono font-bold text-sm text-white">{item.label}</p>
                    <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating UI Elements (Mock) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-24 relative mx-auto max-w-5xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-bg-void via-transparent to-transparent z-20" />

          {/* Animated Dashboard Preview */}
          <div className="relative w-full aspect-video bg-bg-surface/50 border border-border rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl shadow-orange-500/10 group">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Animated Line Chart */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <motion.path
                d="M0,300 Q200,250 400,100 T800,150 T1200,50"
                fill="none"
                stroke="#F97316"
                strokeWidth="3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.path
                d="M0,300 Q200,250 400,100 T800,150 T1200,50 V600 H0 Z"
                fill="url(#orangeGradient)"
                stroke="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ delay: 1, duration: 1 }}
              />
              <defs>
                <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F97316" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Central Stylish Bitcoin Animation */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              {/* Shockwave Pulse */}
              <motion.div
                className="absolute w-4 h-4 bg-orange-500 rounded-full"
                animate={{
                  scale: [0, 50],
                  opacity: [0.5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeOut"
                }}
              />

              {/* Orbiting Elements */}
              {[
                { size: 250, duration: 20, direction: 1 },
                { size: 400, duration: 30, direction: -1 },
                { size: 550, duration: 45, direction: 1 },
              ].map((orbit, i) => (
                <motion.div
                  key={i}
                  className="absolute border border-dashed border-white/5 rounded-full"
                  style={{ width: orbit.size, height: orbit.size }}
                  animate={{ rotate: 360 * orbit.direction }}
                  transition={{ duration: orbit.duration, repeat: Infinity, ease: "linear" }}
                >
                  {/* Orbiter 1 (metallic sphere) */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-slate-400 rounded-full shadow-inner" />
                  {/* Orbiter 2 (glowing orb) */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  {/* Orbiter 3 (mini bitcoin) */}
                  {i === 1 && (
                    <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-5 h-5 text-orange-500/70">
                      <Bitcoin className="w-full h-full" />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Central Bitcoin */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full animate-pulse"></div>
                <Bitcoin className="w-32 h-32 text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.6)]" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Ticker */}
      <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
        <CryptoTicker />
      </div>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 relative" style={{ background: 'rgba(10,22,40,0.6)' }}>
        <div className="cyber-divider absolute top-0 left-0 right-0" />
        <div className="cyber-divider absolute bottom-0 left-0 right-0" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="cyber-badge mb-4"><span className="w-1.5 h-1.5 rounded-full bg-brand-purple status-dot" /> Protocol</div>
            <h2 className="cyber-section-title text-4xl font-extrabold mb-4">How It Works</h2>
            <p className="font-mono text-text-muted text-sm max-w-xl mx-auto">&gt; Three-step threat intelligence pipeline</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting neon line */}
            <div className="hidden md:block absolute top-14 left-[18%] right-[18%] h-px cyber-divider z-0" />

            {[
              { step: '01', title: 'Scan Token', desc: 'Enter any contract address. Engine analyzes liquidity, volatility, and smart contract risk vectors.', icon: Search, color: '#06B6D4' },
              { step: '02', title: 'AI Risk Analysis', desc: 'AI evaluates whale movements, market sentiment, and contract security vulnerabilities.', icon: Brain, color: '#7C3AED' },
              { step: '03', title: 'Protect Portfolio', desc: 'Receive portfolio insights and prioritized risk recommendations before investing.', icon: ShieldCheck, color: '#10B981' },
            ].map((item, idx) => (
              <div key={idx} className="cyber-card rounded p-8 flex flex-col items-center text-center relative z-10">
                {/* Neon step number */}
                <div
                  className="w-14 h-14 rounded flex items-center justify-center mb-6 relative"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}40`, boxShadow: `0 0 16px ${item.color}20` }}
                >
                  <item.icon className="w-7 h-7" style={{ color: item.color }} />
                  <span
                    className="absolute -top-3 -right-3 w-7 h-7 flex items-center justify-center font-mono font-black text-xs border-2 border-bg-void rounded"
                    style={{ background: item.color, boxShadow: `0 0 10px ${item.color}80` }}
                  >
                    {item.step}
                  </span>
                </div>
                <h3 className="font-mono font-bold text-lg mb-3 text-white">{item.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="cyber-badge mb-4"><span className="w-1.5 h-1.5 rounded-full bg-brand-cyan status-dot" /> Arsenal</div>
          <h2 className="cyber-section-title text-4xl font-extrabold mb-4">Why CryptoGuard?</h2>
          <p className="font-mono text-text-muted text-sm">&gt; Processing millions of data points. Delivering one number.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Shield, title: 'AI Risk Score', desc: '0–100 composite score synthesized from 6 live data sources.', color: '#7C3AED' },
            { icon: Activity, title: 'Whale Activity', desc: 'Detect large wallet movements before they move the market.', color: '#06B6D4' },
            { icon: Lock, title: 'Rug Pull Radar', desc: 'Smart contract red flags, honeypot detection & liquidity traps.', color: '#EF4444' },
            { icon: BarChart3, title: 'Portfolio Analyzer', desc: 'Full exposure assessment across all your holdings in seconds.', color: '#10B981' },
          ].map((feature, idx) => (
            <div key={idx} className="cyber-card rounded p-7 group cursor-default">
              <div
                className="w-12 h-12 rounded flex items-center justify-center mb-5 transition-all duration-300"
                style={{
                  background: `${feature.color}18`,
                  border: `1px solid ${feature.color}35`,
                  boxShadow: `0 0 0px ${feature.color}00`,
                }}
              >
                <feature.icon className="w-6 h-6 transition-all duration-300" style={{ color: feature.color }} />
              </div>
              <h3 className="font-mono font-bold text-base text-white mb-2">{feature.title}</h3>
              <p className="text-text-muted text-xs leading-relaxed">{feature.desc}</p>
              {/* Bottom neon accent */}
              <div
                className="h-px mt-4 rounded transition-all duration-300 opacity-0 group-hover:opacity-100"
                style={{ background: `linear-gradient(90deg, ${feature.color}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 pt-16 pb-8" style={{ background: 'rgba(2,6,23,0.95)' }}>
        <div className="cyber-divider absolute top-0 left-0 right-0" />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(6,182,212,0.2))', border: '1px solid rgba(124,58,237,0.4)' }}>
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="font-mono font-black text-lg tracking-tight text-white">CryptoGuard</span>
              </div>
              <p className="font-mono text-xs text-text-muted leading-relaxed">
                AI risk intelligence platform.<br />
                Analyze volatility, whale movements,<br />
                and smart-contract threats.
              </p>
              <div className="cyber-badge mt-4"><span className="w-1.5 h-1.5 rounded-full bg-green-500 status-dot" /> v2.1.0 online</div>
            </div>

            {[{
              heading: '// Product',
              links: ['Risk Scanner', 'Portfolio Analyzer', 'Whale Tracker', 'AI Assistant'],
            }, {
              heading: '// Resources',
              links: ['Risk Methodology', 'API Docs', 'Security Policy'],
            }, {
              heading: '// Community',
              links: ['Twitter', 'Discord', 'Telegram'],
            }].map((col) => (
              <div key={col.heading}>
                <h4 className="font-mono text-[11px] font-bold text-brand-cyan uppercase tracking-widest mb-4">{col.heading}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="font-mono text-xs text-text-muted hover:text-white transition-colors flex items-center gap-1.5 group">
                        <span className="w-1 h-1 rounded-full bg-text-muted group-hover:bg-brand-cyan transition-colors" />
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="cyber-divider mb-6" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest">
              © CryptoGuard 2026 — Real-time threat intelligence
            </p>
            <div className="flex items-center gap-3">
              <span className="cyber-badge text-[9px]"><span className="w-1 h-1 rounded-full bg-green-500 status-dot" /> All Systems Nominal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
