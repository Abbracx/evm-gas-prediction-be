import axios from 'axios';
import { SUPPORTED_CHAINS } from '../utils/chains.js';
import GasPriceModel from '../models/GasPrice.js';
import HistoricalGasModel from '../models/HistoricalGas.js';
import { GasPrice, TransactionEstimate } from '../types/index.js';

/* GasService.ts - Service for handling gas price operations
   This service interacts with the blockchain APIs to fetch current gas prices,
   estimate transaction costs, and manage historical gas data.
*/
export class GasService {
  private lastCallTime = 0;
  private readonly minInterval = 200; // 200ms = 5 calls per second


  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    
    if (timeSinceLastCall < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval - timeSinceLastCall));
    }
    
    this.lastCallTime = Date.now();
  }

  async fetchCurrentGasPrice(chainId: string): Promise<GasPrice | null> {
    await this.rateLimit();
    
    const chain = SUPPORTED_CHAINS[chainId];
    if (!chain || !chain.apiKey) return null;

    try {
      // Fetch gas price from the blockchain API
      // https://docs.etherscan.io/etherscan-v2/api-endpoints/gas-tracker
      const response = await axios.get(chain.apiUrl, {
        params: {
          chainid: chain.chainId,
          module: 'gastracker',
          action: 'gasoracle',
          apikey: chain.apiKey,
        },
      });

      if (response.data.status === '1') {
        const gasData: GasPrice = {
          chain: chainId,
          safe: parseInt(response.data.result.SafeGasPrice),
          standard: parseInt(response.data.result.ProposeGasPrice),
          fast: parseInt(response.data.result.FastGasPrice),
          timestamp: new Date(),
        };

        await new GasPriceModel(gasData).save();
        return gasData;
      }
    } catch (error) {
      console.error(`Error fetching gas price for ${chainId}:`, error);
    }
    return null;
  }

  async getLatestGasPrice(chainId: string): Promise<GasPrice | null> {
    return await GasPriceModel.findOne({ chain: chainId })
      .sort({ timestamp: -1 })
      .lean();
  }

  async getHistoricalData(chainId: string, days: number = 7): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await HistoricalGasModel.find({
      chain: chainId,
      date: { $gte: startDate },
    })
      .sort({ date: -1 })
      .lean();
  }

  async estimateTransactionCost(
    chainId: string,
    gasLimit: number,
    gasPrice?: number
  ): Promise<TransactionEstimate | null> {
    const chain = SUPPORTED_CHAINS[chainId];
    if (!chain) return null;

    let currentGasPrice = gasPrice;
    if (!currentGasPrice) {
      const latestGas = await this.getLatestGasPrice(chainId);
      currentGasPrice = latestGas?.standard || 20;
    }

    const estimatedCost = (currentGasPrice * gasLimit) / 1e9; // Convert from Gwei to native token

    return {
      estimatedCost,
      currency: chain.symbol,
      gasPrice: currentGasPrice,
      gasLimit,
      chain: chainId,
    };
  }

  async aggregateHistoricalData(): Promise<void> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date(yesterday);
    today.setDate(today.getDate() + 1);

    for (const chainId of Object.keys(SUPPORTED_CHAINS)) {
      const gasPrices = await GasPriceModel.find({
        chain: chainId,
        timestamp: { $gte: yesterday, $lt: today },
      });

      if (gasPrices.length > 0) {
        const standardPrices = gasPrices.map((gp) => gp.standard);
        const avgGasPrice = standardPrices.reduce((a, b) => a + b, 0) / standardPrices.length;
        const minGasPrice = Math.min(...standardPrices);
        const maxGasPrice = Math.max(...standardPrices);

        await HistoricalGasModel.findOneAndUpdate(
          { chain: chainId, date: yesterday },
          {
            chain: chainId,
            date: yesterday,
            avgGasPrice,
            minGasPrice,
            maxGasPrice,
          },
          { upsert: true }
        );
      }
    }
  }
}