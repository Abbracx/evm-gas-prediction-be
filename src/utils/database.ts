import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

/* database.ts - MongoDB connection utility
   This file handles the connection to the MongoDB database.
*/

// MongoDB connection
export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/evm-gas-prediction';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};