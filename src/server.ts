import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import redoc from 'redoc-express';
import { connectDatabase } from './utils/database.js';
import { GasService } from './services/GasService.js';
import gasRoutes from './routes/gasRoutes.js';
import { SUPPORTED_CHAINS } from './utils/chains.js';
import { apiSpec} from './utils/doc.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const gasService = new GasService();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/gas', gasRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Redoc documentation
app.get('/docs', redoc({
  title: 'EVM Gas Prediction API Documentation',
  specUrl: '/api-spec'
}));

app.get('/api-spec', (req, res) => {
  res.json(apiSpec);
});

// Cron jobs for data collection
const startCronJobs = (): void => {
  // Fetch gas prices every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log('Fetching current gas prices...');
    for (const chainId of Object.keys(SUPPORTED_CHAINS)) {
      console.log(`Fetching gas prices for ${chainId}...`);
      await gasService.fetchCurrentGasPrice(chainId);
    }
  });

  // Aggregate historical data daily at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Aggregating historical data...');
    await gasService.aggregateHistoricalData();
  });

  // Aggregate historical data every 10 minutes
  // cron.schedule('0 0 * * * *', async () => {
  //   console.log('Aggregating historical data...');
  //   await gasService.aggregateHistoricalData();
  // });
};

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    startCronJobs();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Supported chains: ${Object.keys(SUPPORTED_CHAINS).join(', ')}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();