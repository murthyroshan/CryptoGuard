import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Simple in-memory cache to avoid rate limits (60 seconds TTL)
const apiCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_DURATION = 5 * 60 * 1000; // Increased to 5 minutes to prevent rate limits

async function startServer() {
  const app = express();
  const PORT = 3001;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Proxy for CoinGecko to avoid CORS and hide logic if needed
  app.get("/api/market-data", async (req, res) => {
    try {
      const { vs_currency = "usd", order = "market_cap_desc", per_page = 100, page = 1, sparkline = false } = req.query;
      
      // Check cache to prevent 429 Rate Limit errors
      const cacheKey = `market_${vs_currency}_${order}_${per_page}_${page}_${sparkline}`;
      const cached = apiCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return res.json(cached.data);
      }

      const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
        headers: { Accept: "application/json", "User-Agent": "CryptoGuard/1.0" },
        params: {
          vs_currency,
          order,
          per_page,
          page,
          sparkline
        }
      });
      apiCache.set(cacheKey, { timestamp: Date.now(), data: response.data });
      res.json(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        const retryAfter = error.response.headers["retry-after"];
        console.error(`⚠️ CoinGecko Rate Limit Reached. Retry after ${retryAfter || "60"} seconds.`);
      } else {
        console.error("Error fetching market data:", error);
      }
      if (axios.isAxiosError(error)) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || "Failed to fetch market data" });
      } else {
        res.status(500).json({ error: "Failed to fetch market data" });
      }
    }
  });

  app.get("/api/coin/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Check cache first
      const cacheKey = `coin_${id.toLowerCase().trim()}`;
      const cached = apiCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return res.json(cached.data);
      }

      // CoinGecko IDs are lowercase and trimmed. Handle common tickers.
      let coinId = id.toLowerCase().trim();
      const tickerMap: Record<string, string> = {
        btc: "bitcoin",
        eth: "ethereum",
        sol: "solana",
        doge: "dogecoin",
        ada: "cardano",
        xrp: "ripple",
        dot: "polkadot",
        matic: "matic-network",
      };
      if (tickerMap[coinId]) coinId = tickerMap[coinId];

      const fetchCoinDetails = async (targetId: string) => {
        return axios.get(`https://api.coingecko.com/api/v3/coins/${targetId}`, {
          headers: { Accept: "application/json", "User-Agent": "CryptoGuard/1.0" },
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: true,
            developer_data: true,
            sparkline: true
          }
        });
      };

      try {
        // Try direct ID fetch
        const response = await fetchCoinDetails(coinId);
        apiCache.set(cacheKey, { timestamp: Date.now(), data: response.data });
        res.json(response.data);
      } catch (directError) {
        // If 404, try searching for the coin by symbol/name
        if (axios.isAxiosError(directError) && directError.response?.status === 404) {
          const searchRes = await axios.get(`https://api.coingecko.com/api/v3/search?query=${coinId}`);
          if (searchRes.data.coins && searchRes.data.coins.length > 0) {
            const foundId = searchRes.data.coins[0].id;
            const response = await fetchCoinDetails(foundId);
            apiCache.set(cacheKey, { timestamp: Date.now(), data: response.data });
            return res.json(response.data);
          }
        }
        throw directError;
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        const retryAfter = error.response.headers["retry-after"];
        console.error(`⚠️ CoinGecko Rate Limit Reached while fetching ${req.params.id}. Retry after ${retryAfter || "60"} seconds.`);
      } else {
        console.error(`Error fetching coin data for ${req.params.id}:`, error);
      }
      if (axios.isAxiosError(error)) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || "Failed to fetch coin data" });
      } else {
        res.status(500).json({ error: "Failed to fetch coin data" });
      }
    }
  });

  app.post("/api/analyze", async (req, res) => {
    try {
      console.log("Received AI analysis request...");
      const { prompt, config } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      // Create a cache key based on the prompt length and start to save memory
      const cacheKey = `ai_${prompt?.slice(0, 50)}_${prompt?.length}_${config ? 'json' : 'text'}`;
      
      // Check cache (5 minutes for AI responses to save quota)
      const cached = apiCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
        console.log("Serving AI response from cache");
        return res.json(cached.data);
      }

      if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in server environment");
      }

      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        ...(config && { generationConfig: config }),
      };

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      apiCache.set(cacheKey, { timestamp: Date.now(), data: response.data });
      res.json(response.data);
    } catch (error) {
      console.error("❌ Gemini API Error:", axios.isAxiosError(error) ? error.response?.data : error);
      if (axios.isAxiosError(error)) {
        res.status(error.response?.status || 500).json({ error: error.response?.data || "AI Analysis failed" });
      } else {
        res.status(500).json({ error: "AI Analysis failed" });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Gemini API Key configured: ${!!process.env.GEMINI_API_KEY}`);
  });
}

startServer();
