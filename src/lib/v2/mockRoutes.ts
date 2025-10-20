export type Inputs = {
  chain: string;
  fromToken: string;
  toToken: string;
  amount: number;
  slippagePct: number;
};

export type Route = {
  id: string;
  aggregator: 'ParaSwap' | 'Matcha' | '0x' | 'KyberSwap' | 'Odos' | 'CowSwap' | string;
  outputAmount: number;
  outputFiat: number;
  gasUSD: number;
  priceImpactPct: number;
  hops: number;
  successRatePct: number;
  reliabilityStars: 1 | 2 | 3 | 4 | 5;
  description: string;
  badges?: Array<'BEST' | 'LOW_GAS' | 'FAST' | 'MEV_PROTECTED'>;
};

export function getMockRoutes(inputs: Inputs): Route[] {
  // Simulate network delay
  const baseOutput = inputs.amount * 3782.5; // Mock ETH to USDC rate

  const routes: Route[] = [
    {
      id: '1',
      aggregator: 'ParaSwap',
      outputAmount: baseOutput * 0.9982,
      outputFiat: baseOutput * 0.9982 - 1.32,
      gasUSD: 1.32,
      priceImpactPct: 0.08,
      hops: 1,
      successRatePct: 99.2,
      reliabilityStars: 5,
      description: 'Best net output after gas; single hop with excellent success rate.',
      badges: ['BEST'],
    },
    {
      id: '2',
      aggregator: 'Matcha',
      outputAmount: baseOutput * 0.9979,
      outputFiat: baseOutput * 0.9979 - 3.21,
      gasUSD: 3.21,
      priceImpactPct: 0.09,
      hops: 2,
      successRatePct: 97.8,
      reliabilityStars: 4,
      description: 'Slightly lower output; higher gas due to multiple hops.',
    },
    {
      id: '3',
      aggregator: 'KyberSwap',
      outputAmount: baseOutput * 0.9975,
      outputFiat: baseOutput * 0.9975 - 1.87,
      gasUSD: 1.87,
      priceImpactPct: 0.12,
      hops: 1,
      successRatePct: 98.5,
      reliabilityStars: 4,
      description: 'Better price impact, slightly lower net after gas.',
    },
    {
      id: '4',
      aggregator: 'Odos',
      outputAmount: baseOutput * 0.9968,
      outputFiat: baseOutput * 0.9968 - 4.71,
      gasUSD: 4.71,
      priceImpactPct: 0.15,
      hops: 3,
      successRatePct: 96.2,
      reliabilityStars: 4,
      description: 'More hops for better rate discovery; higher gas cost.',
    },
    {
      id: '5',
      aggregator: '0x',
      outputAmount: baseOutput * 0.9972,
      outputFiat: baseOutput * 0.9972 - 0.87,
      gasUSD: 0.87,
      priceImpactPct: 0.11,
      hops: 1,
      successRatePct: 99.8,
      reliabilityStars: 5,
      description: 'Cheapest gas, slightly lower output.',
      badges: ['LOW_GAS', 'FAST'],
    },
    {
      id: '6',
      aggregator: 'CowSwap',
      outputAmount: baseOutput * 0.9965,
      outputFiat: baseOutput * 0.9965 - 0.0,
      gasUSD: 0.0,
      priceImpactPct: 0.18,
      hops: 1,
      successRatePct: 94.5,
      reliabilityStars: 3,
      description: 'MEV-protected gasless trade; lower success rate.',
      badges: ['MEV_PROTECTED'],
    },
  ];

  // Sort by outputFiat descending (best first)
  return routes.sort((a, b) => b.outputFiat - a.outputFiat);
}

export const MOCK_CHAINS = [
  { id: 'ethereum', name: 'Ethereum', icon: '⟠' },
  { id: 'arbitrum', name: 'Arbitrum', icon: '🔷' },
  { id: 'optimism', name: 'Optimism', icon: '🔴' },
  { id: 'polygon', name: 'Polygon', icon: '🟣' },
];

export const MOCK_TOKENS = [
  { id: 'ETH', name: 'ETH', symbol: 'ETH', balance: 0.5, icon: '⟠' },
  { id: 'USDC', name: 'USD Coin', symbol: 'USDC', balance: 1250.32, icon: '💵' },
  { id: 'USDT', name: 'Tether', symbol: 'USDT', balance: 800.0, icon: '💰' },
  { id: 'DAI', name: 'Dai', symbol: 'DAI', balance: 450.75, icon: '🟡' },
  { id: 'WBTC', name: 'Wrapped Bitcoin', symbol: 'WBTC', balance: 0.012, icon: '₿' },
];

