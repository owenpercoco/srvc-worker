import mongoose, { Document, Model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface BaseProduct {
  name: string;
  description?: string;
  subtitle?: string;
  type?: 'indica' | 'sativa' | 'hybrid';
  price?: number;
  prices?: number[];
  amount?: string;
  category: string;
  quantity: number;
}

interface IProduct extends BaseProduct, Document {
  id: string;
  uuid: string;
}

const ProductSchema: Schema<IProduct> = new Schema<IProduct>({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  uuid: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  type: {
    type: String,
    enum: ['indica', 'sativa', 'hybrid'],
  },
  price: {
    type: Number,
  },
  prices: {
    type: [Number],
  },
  amount: {
    type: String,
  },
  category: {
    type: String,
    enum: ['sungrown', 'premium', 'edible', 'preroll', 'concentrate', 'psychadelic'],
  },
  quantity: {
    type: Number,
    default: () => 1,
  },
});

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
