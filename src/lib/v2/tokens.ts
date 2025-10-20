// Token and Chain Configuration

export interface Token {
  symbol: string;
  icon: string;
  address: string;
  decimals: number;
}

export interface Chain {
  id: string;
  name: string;
  icon: string;
  chainId: number;
}

export const AVAILABLE_TOKENS: Token[] = [
  {
    symbol: 'ETH',
    icon: 'E',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
  },
  {
    symbol: 'USDC',
    icon: '$',
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    decimals: 6,
  },
  {
    symbol: 'DAI',
    icon: 'D',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
  },
  {
    symbol: 'WBTC',
    icon: '₿',
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    decimals: 8,
  },
];

export const AVAILABLE_CHAINS: Chain[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    icon: '⟠',
    chainId: 1,
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    icon: '◈',
    chainId: 42161,
  },
  {
    id: 'optimism',
    name: 'Optimism',
    icon: '🔴',
    chainId: 10,
  },
  {
    id: 'polygon',
    name: 'Polygon',
    icon: '🟣',
    chainId: 137,
  },
];

// Get live token prices from CoinGecko (mock for prototype, replace with real API)
export async function getTokenPrice(symbol: string): Promise<number> {
  // In production, call real price API:
  // const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
  
  // Mock prices for prototype
  const prices: Record<string, number> = {
    'ETH': 3979.85,
    'USDC': 1.00,
    'DAI': 1.00,
    'WBTC': 95234.12,
  };
  
  return prices[symbol] || 0;
}

