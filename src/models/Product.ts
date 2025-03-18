import mongoose, { Document, Model, Schema, SchemaTypes } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { BaseProduct } from '@/data/inventory';

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
    type: [{ amount: Number, quantity: Number, description: String }],
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
  amount_in_stock: {
    type: Number
  },
  quantity: {
    type: Number,
    default: () => 1,
  },
  image: {
    type: String,
  }
});

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
