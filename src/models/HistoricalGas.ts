import mongoose, { Schema, Document } from 'mongoose';
import { HistoricalGasData } from '../types/index.js';

interface IHistoricalGasDocument extends HistoricalGasData, Document {}

const historicalGasSchema = new Schema<IHistoricalGasDocument>({
  chain: { type: String, required: true, index: true },
  date: { type: Date, required: true, index: true },
  avgGasPrice: { type: Number, required: true },
  minGasPrice: { type: Number, required: true },
  maxGasPrice: { type: Number, required: true },
});

historicalGasSchema.index({ chain: 1, date: -1 });

export default mongoose.model<IHistoricalGasDocument>('HistoricalGas', historicalGasSchema);