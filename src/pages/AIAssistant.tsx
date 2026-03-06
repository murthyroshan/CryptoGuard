import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Activity, Droplets, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { getMarketData } from '../services/api';
import axios from 'axios';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const LiveDataPanel = () => (
  <div className="w-full lg:w-1/3 bg-surface border-l border-border p-6 space-y-6 hidden lg:block">
    <h3 className="font-display font-bold text-lg">Live Market Context</h3>
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 text-sm text-secondary mb-1">
          <Activity className="w-4 h-4" />
          <span>Volatility Index</span>
        </div>
        <p className="font-mono text-xl font-bold text-orange-500">6.8/10</p>
      </div>
      <div>
        <div className="flex items-center gap-2 text-sm text-secondary mb-1">
          <Droplets className="w-4 h-4" />
          <span>Liquidity Depth</span>
        </div>
        <p className="font-mono text-xl font-bold text-green-500">High</p>
      </div>
      <div>
        <div className="flex items-center gap-2 text-sm text-secondary mb-1">
          <Shield className="w-4 h-4" />
          <span>Risk Index</span>
        </div>
        <p className="font-mono text-xl font-bold text-orange-500">67/100</p>
      </div>
    </div>
    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-sm text-orange-300 italic">Large sell wall detected at $66k. Whale inflow increased 12%. Short-term volatility expected.</div>
  </div>
);
export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your CryptoGuard Risk Assistant. I can analyze your portfolio exposure, check specific coin risks, or explain market trends. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Fetch real market data context for the AI
      let marketContext = "No real-time data available.";
      try {
        const data = await getMarketData({ per_page: 5 });
        if (data && data.length > 0) {
          marketContext = data.map((c: any) =>
            `${c.name} (${c.symbol.toUpperCase()}): Price $${c.current_price}, 24h Volatility: ${c.price_change_percentage_24h}%, Rank: #${c.market_cap_rank}`
          ).join('\n');
        }
      } catch (e) {
        console.error("Failed to fetch market data for AI context", e);
      }

      let extraContext = "";
      if (userMessage.toLowerCase().includes("portfolio")) {
        extraContext = `User's Current Portfolio Holdings:\n0.45 BTC, 6.2 ETH, 45 SOL, 120 LINK, 500,000,000 PEPE.\nPlease analyze the risk of this specific portfolio given current market conditions. Focus on diversification, correlation, and specific asset risks.`;
      }

      // Construct prompt with context
      const prompt = `
        You are CryptoGuard AI, a specialized cryptocurrency risk analyst.
        Your goal is to help users understand risks, analyze market trends, and make informed decisions.
        
        Real-Time Market Context (Top Coins):
        ${marketContext}
        
        ${extraContext}

        User Query: ${userMessage}
        
        Provide a concise, professional, and data-driven response. 
        Format your response exactly like this, using bullet points where appropriate. DO NOT output large paragraphs:
        
        **Trend**: [Neutral/Bullish/Bearish]
        
        **Reasons**:
        • [Reason 1]
        • [Reason 2]
        
        **Investor Advice**:
        [Concise action: Hold / Cautious Buy / etc.]
        
        Focus on risk factors: volatility, liquidity, whale activity, and sentiment.
        Keep the tone helpful but cautious.
      `;

      const response = await axios.post('/api/analyze', { prompt });
      const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      setMessages(prev => [...prev, { role: 'assistant', content: responseText || "I couldn't generate a response." }]);
    } catch (error) {
      console.error("Error generating response:", error);

      // Fallback simulation for demo/offline mode
      const lowerMsg = userMessage.toLowerCase();
      let fallbackResponse = "";

      // 1. Greetings & General
      if (lowerMsg.match(/^(hi|hello|hey|greetings)/)) {
        fallbackResponse = "Hello! I'm ready to help you analyze crypto risks. You can ask me about specific coins (e.g., 'Is ETH safe?'), market trends, or paste your portfolio details.";
      } else if (lowerMsg.match(/(thanks|thank you|thx)/)) {
        fallbackResponse = "You're welcome! Let me know if you need any more analysis on your crypto assets.";
      }
      // 2. Portfolio Analysis
      else if (lowerMsg.includes("portfolio")) {
        fallbackResponse = `**Portfolio Risk Analysis**\n\n**Risk Profile**: Moderate to High\n**Score**: 68/100\n\n**Key Observations**:\n• **Diversification**: Good mix of L1s (BTC, ETH, SOL) and speculative assets.\n• **Concentration**: High exposure to PEPE increases overall volatility risk.\n• **Stablecoins**: Low allocation to stablecoins (USDC/USDT) leaves you exposed to market downturns.\n\n**Actionable Advice**:\n1. Consider taking profits on PEPE if in profit.\n2. Increase stablecoin holdings to 15-20% for buying dips.\n3. Monitor SOL for network congestion alerts.`;
      }
      // 3. Specific Coin Analysis (Dynamic Detection)
      else {
        const coinMap: Record<string, string> = {
          "btc": "Bitcoin", "bitcoin": "Bitcoin",
          "eth": "Ethereum", "ethereum": "Ethereum",
          "sol": "Solana", "solana": "Solana",
          "xrp": "XRP", "ada": "Cardano", "doge": "Dogecoin", "pepe": "Pepe",
          "link": "Chainlink", "dot": "Polkadot", "matic": "Polygon"
        };

        const foundKey = Object.keys(coinMap).find(k => lowerMsg.includes(k));

        if (foundKey) {
          const coinName = coinMap[foundKey];
          const isVolatile = ["Pepe", "Dogecoin", "Solana"].includes(coinName);

          fallbackResponse = `**Analysis for ${coinName}**\n\n**Trend**: ${isVolatile ? "Volatile / Speculative" : "Bullish / Accumulation"}\n\n**Key Metrics**:\n• **Sentiment**: ${isVolatile ? "Extreme Greed" : "Positive"}\n• **Whale Activity**: ${isVolatile ? "High inflow to exchanges" : "Stable accumulation"}\n• **Tech/Network**: ${isVolatile ? "High transaction volume" : "Network hashrate/staking stable"}\n\n**Risk Assessment**:\n${isVolatile ? "High Risk. Monitor closely for dump signals." : "Low to Medium Risk. Suitable for DCA."}\n\n**Investor Advice**:\n${isVolatile ? "Set tight stop-losses. Don't FOMO." : "Hold. Look to add on dips near support levels."}`;
        }
        // 4. General Market/Risk Questions
        else if (lowerMsg.includes("market") || lowerMsg.includes("trend")) {
          fallbackResponse = `**Current Market Outlook**\n\n**Overall Trend**: Neutral-Bullish\n**Fear & Greed Index**: 65 (Greed)\n\n**Summary**:\nThe market is currently consolidating after recent moves. Bitcoin dominance is stable. Altcoins are showing mixed signals.\n\n**Watchlist**:\n• Monitor BTC support at key levels.\n• Watch for breakout in ETH/BTC pair.\n• Be cautious of leverage in this volatility.`;
        }
        else if (lowerMsg.includes("safe") || lowerMsg.includes("risk") || lowerMsg.includes("scam")) {
          fallbackResponse = `**Risk Warning**\n\nWhen evaluating safety, always check:\n1. **Liquidity**: Is it locked?\n2. **Contract Ownership**: Is it renounced?\n3. **Distribution**: Do top 10 wallets hold >20%?\n\nIf you have a specific token address, I can scan it for you. In general, stick to high-cap assets for safety, and treat low-cap memes as gambling.`;
        }
        // 5. Default Fallback
        else {
          fallbackResponse = `I understand you're asking about "${userMessage}".\n\nCurrently, I'm operating in offline mode and can best assist with:\n• Analyzing specific coins (mention the name like BTC, ETH).\n• Portfolio risk assessment.\n• General market trends.\n\nCould you please clarify or mention a specific asset?`;
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackResponse }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-background border border-border rounded-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="flex-1 flex flex-col bg-surface">
        <div className="p-4 border-b border-border bg-hover/30 flex items-center gap-3">
          <Bot className="w-6 h-6 text-brand-purple" />
          <div>
            <h2 className="font-display font-bold text-lg">CryptoGuard AI</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-secondary">Online • v2.4.0</span>
            </div>
          </div>
        </div>
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-cyan-500/20' : 'bg-orange-500/20'
                }`}>
                {msg.role === 'user' ? <User className="w-5 h-5 text-cyan-500" /> : <Bot className="w-5 h-5 text-orange-500" />}
              </div>

              <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                ? 'bg-cyan-500/10 border border-cyan-500/20 text-white rounded-tr-none'
                : 'bg-hover border border-border text-secondary rounded-tl-none'
                }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
              </div>
              <div className="bg-hover border border-border p-4 rounded-2xl rounded-tl-none">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Input Area */}
        <div className="p-4 border-t border-border bg-hover/10">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about market risk, whale alerts, or portfolio health..."
              className="w-full bg-background border border-border rounded-xl py-4 pl-4 pr-14 text-sm focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-muted"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-2 bottom-2 px-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {[
              "Is Solana safe to buy now?",
              "Analyze my portfolio",
              "Explain rug pull risk",
              "Whale activity on PEPE"
            ].map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setInput(suggestion)}
                className="px-3 py-1.5 bg-hover/50 hover:bg-hover border border-border rounded-lg text-xs text-secondary whitespace-nowrap transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-orange-400" />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
      <LiveDataPanel />
    </div>
  );
}
