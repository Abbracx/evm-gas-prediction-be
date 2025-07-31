# EVM Gas Prediction Platform

A TypeScript-based backend service for predicting and tracking gas prices across Ethereum Virtual Machine (EVM) compatible blockchains.

## 🚀 Features

- **Real-time gas price estimation** for Ethereum, Polygon, and BSC
- **Historical gas price trends** with daily aggregation
- **Transaction cost calculator** with multi-chain support
- **MongoDB integration** for data persistence
- **Docker support** for easy deployment
- **Automated data collection** via cron jobs
- **TypeScript & ES modules** for type safety and modern development
- **RESTful API** with comprehensive endpoints

## 📋 Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- API keys from blockchain explorers:
  - [Etherscan API Key](https://etherscan.io/apis)
  - [Polygonscan API Key](https://polygonscan.com/apis)
  - [BSCScan API Key](https://bscscan.com/apis)

## 🛠️ Installation & Setup

### Method 1: Docker (Recommended)

1. **Clone the repository:**
```bash
git clone https://github.com/Abbracx/evm-gas-prediction-be.git
cd evm-gas-prediction-be
```

2. **Setup environment variables:**
```bash
cp .env.example .env
```

3. **Edit `.env` file with your API keys:**
```env
PORT=3001
MONGODB_URI=mongodb://0.0.0.0:27017/evm-gas-prediction
ETHERSCAN_API_KEY=your_actual_etherscan_api_key
POLYGONSCAN_API_KEY=your_actual_polygonscan_api_key
BSCSCAN_API_KEY=your_actual_bscscan_api_key
```

4. **Install dependencies:**
```bash
yarn install
```

5. **Build the application:**
```bash
yarn run build
```

6. **Start with Docker:**
```bash
yarn run docker:up
```

7. **Verify the service is running:**
```bash
curl http://localhost:3001/health

# Access API documentation
open http://localhost:3001/docs
```

### Method 2: Local Development

1. **Clone and install:**
```bash
git clone https://github.com/Abbracx/evm-gas-prediction-be.git
cd evm-gas-prediction-be
yarn install
```

2. **Start MongoDB:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

3. **Setup environment:**
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. **Run development server:**
```bash
yarn run dev
```

## 📡 API Documentation

### Base URL
```
http://localhost:3001
```

### Interactive Documentation
- **API Documentation**: http://localhost:3001/docs
- **Docker URL**: http://0.0.0.0:3001/docs

> 📖 **Complete interactive API documentation** with request/response examples and try-it-out functionality using Redoc.

### Endpoints

#### 1. Get Current Gas Prices
```http
GET /api/gas/current/:chain
```

**Parameters:**
- `chain` (path): Chain identifier (`ethereum`, `polygon`, `bsc`)

**Example:**
```bash
curl http://localhost:3001/api/gas/current/ethereum
```

**Response:**
```json
{
  "chain": "ethereum",
  "safe": 15,
  "standard": 20,
  "fast": 25,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 2. Get Historical Gas Data
```http
GET /api/gas/history/:chain?days=7
```

**Parameters:**
- `chain` (path): Chain identifier
- `days` (query, optional): Number of days (default: 7)

**Example:**
```bash
curl "http://localhost:3001/api/gas/history/ethereum?days=30"
```

#### 3. Estimate Transaction Cost
```http
GET /api/gas/estimate?chain=ethereum&gasLimit=21000&gasPrice=20
```

**Parameters:**
- `chain` (query, optional): Chain identifier (default: ethereum)
- `gasLimit` (query, required): Gas limit for transaction
- `gasPrice` (query, optional): Gas price in Gwei (uses current if not provided)

**Example:**
```bash
curl "http://localhost:3001/api/gas/estimate?chain=ethereum&gasLimit=21000"
```

**Response:**
```json
{
  "estimatedCost": 0.00042,
  "currency": "ETH",
  "gasPrice": 20,
  "gasLimit": 21000,
  "chain": "ethereum"
}
```

#### 4. Get Supported Chains
```http
GET /api/gas/chains
```

**Response:**
```json
[
  { "id": "ethereum", "name": "Ethereum", "symbol": "ETH" },
  { "id": "polygon", "name": "Polygon", "symbol": "MATIC" },
  { "id": "bsc", "name": "Binance Smart Chain", "symbol": "BNB" }
]
```

#### 5. Health Check
```http
GET /health
```

#### 6. API Documentation
```http
GET /docs
```

**Description:** Interactive API documentation with Redoc interface

**Access:** http://localhost:3001/docs (local) or http://0.0.0.0:3001/docs (Docker)

## 🔧 Development Scripts

```bash
# Development
yarn run dev          # Start development server with hot reload
yarn run build        # Build TypeScript to JavaScript
yarn start           # Start production server

# Code Quality
yarn run lint        # Run ESLint
yarn run format      # Format code with Prettier

# Docker
yarn run docker:up   # Start services with Docker Compose
yarn run docker:down # Stop Docker services
```

## 🏗️ Project Structure

```
src/
├── models/
│   ├── GasPrice.ts      # Gas price MongoDB schema
│   └── HistoricalGas.ts # Historical data schema
├── services/
│   └── GasService.ts    # Core business logic
├── routes/
│   └── gasRoutes.ts     # API route definitions
├── types/
│   └── index.ts         # TypeScript interfaces
├── utils/
│   ├── chains.ts        # Chain configurations
│   ├── doc.ts           # API documentation spec
│   └── database.ts      # Database connection
└── server.ts            # Main application entry
```

## 🔄 Data Collection

The platform automatically:
- **Fetches gas prices every 5 minutes** from blockchain APIs
- **Aggregates daily historical data** at midnight
- **Stores data in MongoDB** with proper indexing for fast queries

## 🐳 Docker Configuration

### Services
- **App Container**: Node.js application on port 3001
- **MongoDB Container**: Database on port 27017 with persistent storage

### Docker Access URLs
- **Application**: http://0.0.0.0:3001
- **API Documentation**: http://0.0.0.0:3001/docs  
- **Health Check**: http://0.0.0.0:3001/health

### Docker Commands
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build -d
```

## 🔍 Monitoring & Logs

### Application Logs
```bash
# Docker logs
docker-compose logs -f app

# Local development
yarn run dev  # Logs appear in terminal
```

### Database Access
```bash
# Connect to MongoDB
docker exec -it evm-gas-mongodb mongosh evm-gas-prediction

# View collections
show collections
db.gasprices.find().limit(5)
```

## 🚨 Troubleshooting

### Common Issues

1. **API Key Errors:**
   - Ensure all API keys are valid and added to `.env`
   - Check API rate limits on blockchain explorer sites

2. **MongoDB Connection:**
   ```bash
   # Check if MongoDB is running
   docker ps | grep mongo
   
   # Restart MongoDB
   docker restart evm-gas-mongodb
   ```

3. **Port Conflicts:**
   - Change `PORT` in `.env` if 3001 is occupied
   - Ensure MongoDB port 27017 is available

4. **Build Errors:**
   ```bash
   # Clean and rebuild
   rm -rf dist node_modules
   yarn install
   yarn run build
   ```

## 🔐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|----------|
| `PORT` | Server port | No | 3001 |
| `MONGODB_URI` | MongoDB connection string | No | mongodb://localhost:27017/evm-gas-prediction |
| `ETHERSCAN_API_KEY` | Etherscan API key | Yes | - |
| `POLYGONSCAN_API_KEY` | Polygonscan API key | Yes | - |
| `BSCSCAN_API_KEY` | BSCScan API key | Yes | - |

## 📈 Supported Chains

| Chain | Symbol | API Provider | Network |
|-------|--------|--------------|----------|
| Ethereum | ETH | Etherscan | Mainnet |
| Polygon | MATIC | Polygonscan | Mainnet |
| Binance Smart Chain | BNB | BSCScan | Mainnet |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper TypeScript types
4. Run linting and formatting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details
