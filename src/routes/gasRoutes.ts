import { Router, Request, Response } from 'express';
import { GasService } from '../services/GasService.js';
import { getChain, SUPPORTED_CHAINS } from '../utils/chains.js';

const router = Router();
const gasService = new GasService();

// Get current gas prices for a specific chain
router.get('/current/:chain', async (req: Request, res: Response) => {
  try {
    const { chain } = req.params;
    const chainConfig = getChain(chain);
    
    if (!chainConfig) {
      return res.status(400).json({ error: 'Unsupported chain' });
    }

    const gasPrice = await gasService.getLatestGasPrice(chain);
    if (!gasPrice) {
      return res.status(404).json({ error: 'Gas price data not available' });
    }

    res.json(gasPrice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gas price' });
  }
});

// Get historical gas data
router.get('/history/:chain', async (req: Request, res: Response) => {
  try {
    const { chain } = req.params;
    const { days = '7' } = req.query;
    
    const chainConfig = getChain(chain);
    if (!chainConfig) {
      return res.status(400).json({ error: 'Unsupported chain' });
    }

    const historicalData = await gasService.getHistoricalData(chain, parseInt(days as string));
    res.json(historicalData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// Estimate transaction cost
router.get('/estimate', async (req: Request, res: Response) => {
  try {
    const { chain = 'ethereum', gasLimit, gasPrice } = req.query;
    
    if (!gasLimit) {
      return res.status(400).json({ error: 'gasLimit is required' });
    }

    const chainConfig = getChain(chain as string);
    if (!chainConfig) {
      return res.status(400).json({ error: 'Unsupported chain' });
    }

    const estimate = await gasService.estimateTransactionCost(
      chain as string,
      parseInt(gasLimit as string),
      gasPrice ? parseInt(gasPrice as string) : undefined
    );

    if (!estimate) {
      return res.status(500).json({ error: 'Failed to estimate transaction cost' });
    }

    res.json(estimate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to estimate transaction cost' });
  }
});

// Get supported chains
router.get('/chains', (req: Request, res: Response) => {
  const chains = Object.values(SUPPORTED_CHAINS).map(({ id, name, symbol }) => ({
    id,
    name,
    symbol,
  }));
  res.json(chains);
});

export default router;