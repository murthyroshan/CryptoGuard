import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BookOpen, Play, ExternalLink, Search, ChevronRight,
    Cpu, Wallet, BarChart2, Shield, ArrowRight, GraduationCap,
    Globe, CheckCircle,
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────

const VIDEOS = [
    {
        title: 'What is Cryptocurrency? Explained in 5 Minutes',
        desc: 'A quick, jargon-free introduction to crypto, how it works, and why it matters.',
        embed: 'https://www.youtube.com/embed/8RjHAcSMbhQ',
        duration: '5 min',
    },
    {
        title: 'Cryptocurrency Full Course for Beginners',
        desc: 'The complete beginner course — from Bitcoin basics to wallets, exchanges, and beyond.',
        embed: 'https://www.youtube.com/embed/bRLIeRRV6X4',
        duration: 'Full Course',
    },
    {
        title: 'How to Invest in Crypto for Beginners',
        desc: 'Step-by-step guide on how to start investing in cryptocurrency safely and smartly.',
        embed: 'https://www.youtube.com/embed/aaMFEk5Zuq4',
        duration: 'Beginner',
    },
];

const CONCEPTS = [
    {
        icon: Shield,
        title: 'What is Cryptocurrency',
        desc: 'Digital money that uses blockchain technology to enable decentralized, peer-to-peer transactions without any central authority.',
        color: '#7C3AED',
    },
    {
        icon: Cpu,
        title: 'What is Blockchain',
        desc: 'A distributed ledger that records transactions securely across thousands of computers, making data immutable and transparent.',
        color: '#06B6D4',
    },
    {
        icon: Wallet,
        title: 'What are Crypto Wallets',
        desc: 'Digital wallets used to store, send, and receive cryptocurrency. They hold your private keys securely, not the coins themselves.',
        color: '#10B981',
    },
    {
        icon: BarChart2,
        title: 'What is Crypto Trading',
        desc: 'The buying and selling of cryptocurrencies on exchanges to profit from price movements, similar to stock trading.',
        color: '#F59E0B',
    },
];

const RESOURCES = [
    {
        name: 'Binance Academy',
        desc: 'Free articles and guides explaining blockchain and cryptocurrency concepts for all skill levels.',
        url: 'https://academy.binance.com',
        icon: '📚',
        tag: 'Free',
    },
    {
        name: 'Coursera Crypto Courses',
        desc: 'University-level courses about blockchain and cryptocurrency technologies from top institutions.',
        url: 'https://www.coursera.org/search?query=cryptocurrency',
        icon: '🎓',
        tag: 'Courses',
    },
    {
        name: 'Great Learning',
        desc: 'Beginner-friendly introduction to crypto fundamentals with structured lessons and quizzes.',
        url: 'https://www.mygreatlearning.com/cryptocurrency/free-courses',
        icon: '🌐',
        tag: 'Free',
    },
];

const LEARNING_PATH = [
    { step: '01', title: 'Understand Cryptocurrency Basics', desc: 'Learn what crypto is, how it works, and the most popular coins.' },
    { step: '02', title: 'Learn Blockchain Fundamentals', desc: 'Understand how blockchains record and verify transactions securely.' },
    { step: '03', title: 'Understand Wallets and Exchanges', desc: 'Set up a wallet and learn how to use crypto exchanges safely.' },
    { step: '04', title: 'Learn Crypto Trading Basics', desc: 'Explore order types, charts, and the fundamentals of trading.' },
    { step: '05', title: 'Study Risk Management', desc: 'Learn position sizing, diversification, and how to avoid common mistakes.' },
];

// ─── Video Card ─────────────────────────────────────

function VideoCard({ video, idx }: { video: typeof VIDEOS[0]; idx: number }) {
    const [playing, setPlaying] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="cyber-card rounded-xl overflow-hidden flex flex-col"
        >
            {/* Video embed / thumbnail */}
            <div className="relative aspect-video bg-black">
                {playing ? (
                    <iframe
                        src={`${video.embed}?autoplay=1`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                ) : (
                    <>
                        <img
                            src={`https://img.youtube.com/vi/${video.embed.split('/').pop()}/hqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover opacity-80"
                        />
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/40" />
                        {/* Play button */}
                        <button
                            onClick={() => setPlaying(true)}
                            className="absolute inset-0 flex items-center justify-center group"
                        >
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(124,58,237,0.9), rgba(6,182,212,0.9))',
                                    boxShadow: '0 0 24px rgba(124,58,237,0.5)',
                                }}
                            >
                                <Play className="w-6 h-6 text-white fill-white ml-1" />
                            </div>
                        </button>
                        {/* Duration badge */}
                        <span className="absolute top-3 right-3 cyber-badge text-[9px]">{video.duration}</span>
                    </>
                )}
            </div>

            {/* Info */}
            <div className="p-5 flex-1 flex flex-col gap-2">
                <h3 className="font-mono font-bold text-sm text-white leading-snug">{video.title}</h3>
                <p className="text-text-muted text-xs leading-relaxed flex-1">{video.desc}</p>
                <button
                    onClick={() => setPlaying(true)}
                    className="mt-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-brand-cyan hover:text-white transition-colors"
                >
                    <Play className="w-3 h-3 fill-current" /> Watch Now
                </button>
            </div>
        </motion.div>
    );
}

// ─── Main Page ──────────────────────────────────────

export function LearningHub() {
    const [search, setSearch] = useState('');

    const filteredConcepts = CONCEPTS.filter(
        (c) =>
            search === '' ||
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.desc.toLowerCase().includes(search.toLowerCase()),
    );

    const filteredVideos = VIDEOS.filter(
        (v) =>
            search === '' || v.title.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="space-y-12 pb-16">

            {/* Page Header */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl p-8"
                style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.08))',
                    border: '1px solid rgba(124,58,237,0.25)',
                }}
            >
                {/* Corner brackets */}
                <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-brand-cyan" />
                <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-brand-purple" />

                <div className="cyber-badge mb-4">
                    <GraduationCap className="w-3 h-3" />
                    Education Center
                </div>
                <h1 className="cyber-section-title text-3xl md:text-4xl font-extrabold mb-3">
                    Crypto Learning Hub
                </h1>
                <p className="font-mono text-sm text-text-muted max-w-2xl leading-relaxed">
                    <span className="text-brand-cyan">&gt;</span> Learn cryptocurrency basics, blockchain technology, and crypto investing
                    with beginner-friendly guides and videos.
                </p>
            </motion.div>

            {/* Search */}
            <div className="relative max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search crypto concepts..."
                    className="cyber-input w-full rounded py-3 pl-10 pr-4 text-sm"
                />
            </div>

            {/* ── Beginner Videos ──────────────────────── */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <Play className="w-5 h-5 text-brand-purple" />
                    <h2 className="font-mono font-black text-lg text-white uppercase tracking-widest">
                        Beginner Crypto Videos
                    </h2>
                    <div className="flex-1 cyber-divider" />
                </div>

                {filteredVideos.length === 0 ? (
                    <p className="font-mono text-xs text-text-muted">No videos match your search.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVideos.map((v, i) => <VideoCard key={i} video={v} idx={i} />)}
                    </div>
                )}
            </section>

            {/* ── Crypto Basics ────────────────────────── */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="w-5 h-5 text-brand-cyan" />
                    <h2 className="font-mono font-black text-lg text-white uppercase tracking-widest">
                        Crypto Basics
                    </h2>
                    <div className="flex-1 cyber-divider" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredConcepts.map((c, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="cyber-card rounded-xl p-6 flex gap-4"
                        >
                            <div
                                className="w-11 h-11 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{ background: `${c.color}18`, border: `1px solid ${c.color}40` }}
                            >
                                <c.icon className="w-5 h-5" style={{ color: c.color }} />
                            </div>
                            <div>
                                <h3 className="font-mono font-bold text-sm text-white mb-1.5">{c.title}</h3>
                                <p className="text-text-muted text-xs leading-relaxed">{c.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                    {filteredConcepts.length === 0 && (
                        <p className="font-mono text-xs text-text-muted col-span-2">No concepts match your search.</p>
                    )}
                </div>
            </section>

            {/* ── Learning Path + Resources (side-by-side on lg) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Learning Path */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <ChevronRight className="w-5 h-5 text-brand-purple" />
                        <h2 className="font-mono font-black text-lg text-white uppercase tracking-widest">
                            Recommended Learning Path
                        </h2>
                    </div>

                    <div className="relative pl-6">
                        {/* Vertical neon line */}
                        <div
                            className="absolute left-[11px] top-3 bottom-3 w-px"
                            style={{ background: 'linear-gradient(to bottom, #7C3AED, #06B6D4)' }}
                        />

                        <div className="space-y-4">
                            {LEARNING_PATH.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative flex gap-4"
                                >
                                    {/* Step circle */}
                                    <div
                                        className="absolute -left-[35px] top-1 w-5 h-5 rounded-full flex items-center justify-center font-mono font-black text-[9px] flex-shrink-0"
                                        style={{
                                            background: i < 2 ? 'linear-gradient(135deg,#7C3AED,#06B6D4)' : 'rgba(124,58,237,0.2)',
                                            border: '1px solid rgba(124,58,237,0.5)',
                                            boxShadow: i < 2 ? '0 0 8px rgba(124,58,237,0.5)' : 'none',
                                        }}
                                    >
                                        {i < 2 ? <CheckCircle className="w-3 h-3 text-white" /> : <span className="text-brand-cyan">{item.step}</span>}
                                    </div>

                                    <div className="cyber-card rounded-lg p-4 flex-1">
                                        <p className="font-mono font-bold text-sm text-white mb-1">{item.title}</p>
                                        <p className="text-text-muted text-xs leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Resources */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <Globe className="w-5 h-5 text-brand-cyan" />
                        <h2 className="font-mono font-black text-lg text-white uppercase tracking-widest">
                            Learning Resources
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {RESOURCES.map((r, i) => (
                            <motion.a
                                key={i}
                                href={r.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="cyber-card rounded-xl p-5 flex items-start gap-4 group cursor-pointer block"
                                style={{ textDecoration: 'none' }}
                            >
                                <div
                                    className="w-11 h-11 rounded text-xl flex items-center justify-center flex-shrink-0"
                                    style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}
                                >
                                    {r.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono font-bold text-sm text-white group-hover:text-brand-cyan transition-colors">
                                            {r.name}
                                        </span>
                                        <span className="cyber-badge text-[9px] px-1.5 py-0.5">{r.tag}</span>
                                    </div>
                                    <p className="text-text-muted text-xs leading-relaxed">{r.desc}</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-brand-cyan transition-colors flex-shrink-0 mt-0.5" />
                            </motion.a>
                        ))}
                    </div>
                </section>
            </div>

        </div>
    );
}
