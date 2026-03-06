export const calculateRiskScore = (coinData: any) => {
  if (!coinData) return {
    score: 0,
    breakdown: {
      volatility: 0,
      liquidity: 0,
      marketCap: 0,
      sentiment: 0,
      whaleActivity: 0
    }
  };

  let score = 50; // Base score
  const breakdown = {
    volatility: 0,
    liquidity: 0,
    marketCap: 0,
    sentiment: 0,
    whaleActivity: 0
  };

  // Volatility Factor
  const priceChange24h = Math.abs(coinData.price_change_percentage_24h || 0);
  if (priceChange24h > 10) { score += 20; breakdown.volatility = 20; }
  else if (priceChange24h > 5) { score += 10; breakdown.volatility = 10; }
  else if (priceChange24h < 2) { score -= 5; breakdown.volatility = -5; }

  // Market Cap Factor
  const marketCap = coinData.market_cap || 0;
  if (marketCap < 10000000) { score += 25; breakdown.marketCap = 25; }
  else if (marketCap < 100000000) { score += 15; breakdown.marketCap = 15; }
  else if (marketCap > 10000000000) { score -= 15; breakdown.marketCap = -15; }

  // Liquidity
  const volume = coinData.total_volume || 0;
  const volCapRatio = volume / (marketCap || 1);
  if (volCapRatio < 0.01) { score += 15; breakdown.liquidity = 15; }
  else if (volCapRatio > 0.1) { score -= 10; breakdown.liquidity = -10; }

  // Sentiment (mocked for demo)
  breakdown.sentiment = Math.floor(Math.random() * 20) - 10;
  score += breakdown.sentiment;

  // Whale Activity (mocked for demo)
  breakdown.whaleActivity = Math.floor(Math.random() * 20) - 5;
  score += breakdown.whaleActivity;

  return {
    score: Math.min(Math.max(Math.round(score), 0), 100),
    breakdown
  };
};

export const getRiskLevel = (score: number) => {
  if (score < 30) return { label: 'LOW', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' };
  if (score < 60) return { label: 'MEDIUM', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
  if (score < 85) return { label: 'HIGH', color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
  return { label: 'CRITICAL', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
};
