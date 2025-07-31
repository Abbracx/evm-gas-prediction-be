import { Chain } from '../types/index.js';

export const SUPPORTED_CHAINS: Record<string, Chain> = {
  ethereum: {
    id: 'ethereum',
    chainId: '1',
    name: 'Ethereum',
    symbol: 'ETH',
    apiUrl: 'https://api.etherscan.io/api',
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  polygon: {
    id: 'polygon',
    chainId: '137',
    name: 'Polygon',
    symbol: 'MATIC',
    apiUrl: 'https://api.polygonscan.com/api',
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
  bsc: {
    id: 'bsc',
    chainId: '56',
    name: 'Binance Smart Chain',
    symbol: 'BNB',
    apiUrl: 'https://api.bscscan.com/api',
    apiKey: process.env.BSCSCAN_API_KEY,
  },
};

export const getChain = (chainId: string): Chain | null => {
  return SUPPORTED_CHAINS[chainId] || null;
};