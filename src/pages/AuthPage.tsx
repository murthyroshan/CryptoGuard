import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, ArrowRight, Loader2, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    phoneEmailListener: (userObj: { user_json_url: string }) => void;
  }
}

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [bootLine, setBootLine] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const bootSequence = [
    '> CRYPTOGUARD v2.1.0 booting...',
    '> Initializing threat intelligence engine...',
    '> Connecting to blockchain network...',
    '> All systems nominal. Awaiting authentication.',
  ];

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setBootLine(i);
      if (i >= bootSequence.length) clearInterval(id);
    }, 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    window.phoneEmailListener = (userObj) => {
      const { user_json_url } = userObj;
      setIsLoading(true);
      setErrorMsg('Phone verified. Finalizing login...');
      setTimeout(() => {
        login(`user_phone_${user_json_url.slice(-10)}`);
        setIsLoading(false);
        navigate('/dashboard');
      }, 1500);
    };

    const script = document.createElement('script');
    script.src = 'https://www.phone.email/sign_in_button_v1.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [login, navigate]);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!validateEmail(email)) { setErrorMsg('ERR: Invalid email format.'); return; }
    if (password.length < 8) { setErrorMsg('ERR: Password must be ≥ 8 characters.'); return; }
    setIsLoading(true);
    setTimeout(() => {
      login(email);
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bg-void text-text-primary font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-cyan/15 rounded-full blur-[120px]" />
        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.12) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back to Home */}
        <div className="mb-5 flex justify-start">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest px-4 py-2.5 border transition-all duration-200 group"
            style={{
              color: '#64748B',
              borderColor: 'rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.02)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = '#06B6D4';
              el.style.borderColor = 'rgba(6,182,212,0.4)';
              el.style.background = 'rgba(6,182,212,0.06)';
              el.style.boxShadow = '0 0 12px rgba(6,182,212,0.15)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.color = '#64748B';
              el.style.borderColor = 'rgba(255,255,255,0.08)';
              el.style.background = 'rgba(255,255,255,0.02)';
              el.style.boxShadow = 'none';
            }}
          >
            <span className="transition-transform duration-200 group-hover:-translate-x-0.5 text-base">←</span>
            Back to Home
          </Link>
        </div>

        {/* Terminal boot log */}
        <div className="mb-6 p-4 rounded bg-black/60 border border-white/6 font-mono text-[11px] text-green-500/80 space-y-1">
          {bootSequence.slice(0, bootLine).map((line, i) => (
            <div key={i} className={i === bootLine - 1 ? 'terminal-cursor' : ''}>{line}</div>
          ))}
        </div>

        {/* Auth card */}
        <div
          className="cyber-card rounded-lg p-8 relative"
          style={{ background: 'rgba(7,14,30,0.9)', backdropFilter: 'blur(24px)' }}
        >
          {/* Extra corner brackets for the card */}
          <span className="absolute top-[-1px] right-[-1px] w-4 h-4 border-t-2 border-r-2 border-brand-cyan" />
          <span className="absolute bottom-[-1px] left-[-1px] w-4 h-4 border-b-2 border-l-2 border-brand-purple" />

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 relative"
              style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))',
                border: '1px solid rgba(124,58,237,0.5)',
                boxShadow: '0 0 24px rgba(124,58,237,0.3)',
              }}
            >
              <Shield className="w-7 h-7 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-500 status-dot border-2 border-bg-void" />
            </div>

            <div className="cyber-badge mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan status-dot" />
              {isLogin ? 'Authentication Portal' : 'New Agent Registration'}
            </div>

            <h1 className="font-mono font-black text-2xl tracking-tight text-center cyber-section-title">
              {isLogin ? 'System Access' : 'Initialize Account'}
            </h1>
            <p className="font-mono text-[11px] text-text-muted mt-2 text-center tracking-wider uppercase">
              {isLogin ? 'Enter credentials to access risk dashboard' : 'Create your threat intelligence profile'}
            </p>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded border border-red-500/30 bg-red-500/8 font-mono text-red-400 text-xs flex items-center gap-2">
              <span className="text-red-500">■</span> {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="cyber-badge inline-flex">
                <Terminal className="w-3 h-3" /> Identity Credential
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="cyber-input w-full rounded py-3 pl-10 pr-4 text-sm"
                  placeholder="agent@cryptoguard.io"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="cyber-badge inline-flex">
                <Lock className="w-3 h-3" /> Access Key
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cyber-input w-full rounded py-3 pl-10 pr-4 text-sm"
                  placeholder="min. 8 characters"
                />
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={isLoading}
                className="cyber-btn w-full justify-center text-center"
                style={{ clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)' }}
              >
                {isLoading && !errorMsg.startsWith('Phone') ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</>
                ) : (
                  <>{isLogin ? 'Initiate Login' : 'Create Profile'} <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative flex py-5 items-center">
            <div className="cyber-divider flex-grow" />
            <span className="mx-4 font-mono text-[10px] text-text-muted uppercase tracking-widest">Or</span>
            <div className="cyber-divider flex-grow" />
          </div>

          {/* Phone.Email Button */}
          <div className="pe_signin_button" data-client-id="11069078944237683366" />

          {/* Toggle */}
          <div className="mt-6 pt-5 border-t border-border/50 text-center">
            <p className="font-mono text-xs text-text-muted tracking-wide">
              {isLogin ? '> No account? ' : '> Already registered? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-brand-cyan hover:text-white transition-colors font-bold"
              >
                {isLogin ? 'register --new' : 'login --existing'}
              </button>
            </p>
          </div>
        </div>

        {/* Bottom system info */}
        <div className="mt-4 flex items-center justify-between px-1">
          <span className="font-mono text-[10px] text-text-muted tracking-widest uppercase">CryptoGuard v2.1.0</span>
          <span className="cyber-badge text-[9px]"><span className="w-1 h-1 rounded-full bg-green-500 status-dot" />Secure Connection</span>
        </div>
      </motion.div>
    </div>
  );
}