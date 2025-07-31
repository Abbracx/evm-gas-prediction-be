import mongoose, { Schema, Document } from 'mongoose';
import { GasPrice } from '../types/index.js';

interface IGasPriceDocument extends GasPrice, Document {}

const gasPriceSchema = new Schema<IGasPriceDocument>({
  chain: { type: String, required: true, index: true },
  safe: { type: Number, required: true },
  standard: { type: Number, required: true },
  fast: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
});

gasPriceSchema.index({ chain: 1, timestamp: -1 });

export default mongoose.model<IGasPriceDocument>('GasPrice', gasPriceSchema);