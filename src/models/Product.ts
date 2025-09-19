import mongoose, { Document, Model, Schema, SchemaTypes } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { BaseProduct } from '@/data/inventory';

interface IProduct extends BaseProduct, Document {
  uuid: string;
  is_deleted?: boolean;
}

const ProductSchema: Schema<IProduct> = new Schema<IProduct>({
  uuid: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  long_description: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  type: {
    type: String,
    enum: ['indica', 'sativa', 'hybrid', 'indicadominant', 'sativadominant'],
  },
  price: {
    type: [{ amount: String, description: { type: String } }],
    default: [],
  },
  amount: {
    type: String,
  },
  category: {
    type: String,
    enum: ['sungrown', 'premium', 'edible', 'preroll', 'concentrate', 'psychadelic'],
  },
  is_in_stock: {
    type: Boolean,
  },
  // Removed amount_in_stock and quantity fields per refactor
  image: {
    type: String,
  }
});

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
