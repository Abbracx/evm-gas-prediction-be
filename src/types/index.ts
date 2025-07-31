export interface Chain {
  id: string;
  chainId: string;
  name: string;
  symbol: string;
  apiUrl: string;
  apiKey?: string;
}

export interface GasPrice {
  chain: string;
  safe: number;
  standard: number;
  fast: number;
  timestamp: Date;
}

export interface TransactionEstimate {
  estimatedCost: number;
  currency: string;
  gasPrice: number;
  gasLimit: number;
  chain: string;
}

export interface HistoricalGasData {
  chain: string;
  date: Date;
  avgGasPrice: number;
  minGasPrice: number;
  maxGasPrice: number;
}