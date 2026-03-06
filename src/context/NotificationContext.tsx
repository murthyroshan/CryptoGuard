import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

export type NotificationSeverity =
  | "danger"
  | "warning"
  | "success"
  | "info"
  | "ai";
export type NotificationCategory = "alert" | "security" | "ai" | "info";

export interface Notification {
  id: string;
  type:
  | "whale"
  | "high_risk"
  | "rug_pull"
  | "portfolio_risk"
  | "price_volatility"
  | "market_risk"
  | "portfolio_pnl"
  | "token_scan"
  | "opportunity"
  | "security"
  | "ai_insight";
  title: string;
  message: string;
  subtext?: string;
  timestamp: Date;
  read: boolean;
  severity: NotificationSeverity;
  category: NotificationCategory;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_NOTIFICATIONS: Omit<Notification, "id" | "read">[] = [
  {
    type: "whale",
    title: "🐋 Whale Alert",
    message: "1,200 ETH moved from Coinbase → Binance",
    subtext: "Possible market volatility expected.",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    severity: "danger",
    category: "alert",
  },
  {
    type: "rug_pull",
    title: "🚨 Rug Pull Warning",
    message: "Liquidity removed from XYZ token pool.",
    subtext: "Investors may face significant losses.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    severity: "danger",
    category: "alert",
  },
  {
    type: "high_risk",
    title: "⚠️ High Risk Alert",
    message: "PEPE token risk score: 89/100",
    subtext: "Potential rug pull indicators detected.",
    timestamp: new Date(Date.now() - 9 * 60 * 1000),
    severity: "warning",
    category: "alert",
  },
  {
    type: "portfolio_risk",
    title: "⚠️ Portfolio Risk Alert",
    message: "Your portfolio risk score increased to 72.",
    subtext: "High exposure to SOL detected.",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    severity: "warning",
    category: "alert",
  },
  {
    type: "market_risk",
    title: "🚨 Market Risk Alert",
    message: "Crypto Market Risk Index increased to 78.",
    subtext: "Market instability detected.",
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    severity: "danger",
    category: "alert",
  },
  {
    type: "price_volatility",
    title: "📊 Volatility Alert",
    message: "SOL volatility increased by 12% in the last hour.",
    subtext: "High market movement detected.",
    timestamp: new Date(Date.now() - 28 * 60 * 1000),
    severity: "warning",
    category: "alert",
  },
  {
    type: "portfolio_pnl",
    title: "💰 Portfolio Update",
    message: "Your portfolio value increased by 8% today.",
    subtext: "Total value: $48,920",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    severity: "success",
    category: "info",
  },
  {
    type: "token_scan",
    title: "🔍 Scan Complete",
    message: "Solana risk score: 42 (Moderate Risk)",
    subtext: "AI Insights Available.",
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    severity: "info",
    category: "info",
  },
  {
    type: "opportunity",
    title: "🚀 Opportunity Alert",
    message: "Chainlink shows low risk and strong liquidity signals.",
    subtext: "Consider reviewing your allocation.",
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    severity: "success",
    category: "alert",
  },
  {
    type: "security",
    title: "🔐 Security Alert",
    message: "New login detected from a different device.",
    subtext: "If this wasn't you, change your password immediately.",
    timestamp: new Date(Date.now() - 120 * 60 * 1000),
    severity: "danger",
    category: "security",
  },
  {
    type: "ai_insight",
    title: "🤖 AI Insight",
    message: "Whale accumulation detected in BTC.",
    subtext: "Possible upward movement expected.",
    timestamp: new Date(Date.now() - 150 * 60 * 1000),
    severity: "ai",
    category: "ai",
  },
];

// ─── Live feed pool — rotated to simulate new alerts arriving ─────────────────
const LIVE_POOL: Omit<Notification, "id" | "read">[] = [
  {
    type: "whale",
    title: "🐋 Whale Alert",
    message: "8,500 BTC transferred from unknown wallet → Kraken",
    subtext: "Large sell pressure possible.",
    timestamp: new Date(),
    severity: "danger",
    category: "alert",
  },
  {
    type: "ai_insight",
    title: "🤖 AI Insight",
    message: "Unusual derivatives activity detected on ETH.",
    subtext: "Short squeeze conditions forming.",
    timestamp: new Date(),
    severity: "ai",
    category: "ai",
  },
  {
    type: "opportunity",
    title: "🚀 Opportunity Alert",
    message: "AVAX showing strong accumulation signals.",
    subtext: "Risk score: 28 (Low Risk).",
    timestamp: new Date(),
    severity: "success",
    category: "alert",
  },
  {
    type: "price_volatility",
    title: "📊 Volatility Alert",
    message: "BTC volatility spiked 18% in the last 30 minutes.",
    subtext: "Trade with caution.",
    timestamp: new Date(),
    severity: "warning",
    category: "alert",
  },
  {
    type: "market_risk",
    title: "🚨 Market Risk Alert",
    message: "Global Crypto Risk Index jumped to 82.",
    subtext: "Extreme fear detected across markets.",
    timestamp: new Date(),
    severity: "danger",
    category: "alert",
  },
];

let livePoolIndex = 0;

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    SEED_NOTIFICATIONS.map((n) => ({ ...n, id: uid(), read: false })),
  );

  const liveIndexRef = useRef(livePoolIndex);

  // Simulate live alerts every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const template = LIVE_POOL[liveIndexRef.current % LIVE_POOL.length];
      liveIndexRef.current += 1;
      const newAlert: Notification = {
        ...template,
        id: uid(),
        read: false,
        timestamp: new Date(),
      };
      setNotifications((prev) => [newAlert, ...prev]);
    }, 5 * 60_000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllRead, markRead, dismiss }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  return ctx;
}
