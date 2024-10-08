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
    enum: ['indica', 'sativa', 'hybrid'],
  },
  price: {
    type: SchemaTypes.Mixed,
    validate: {
      validator: function(value: any) {
        return (
          typeof value === 'number' ||
          (Array.isArray(value) && value.every((item) => typeof item === 'number'))
        );
      },
      message: 'Price must be a number or an array of numbers',
    },
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
  image: {
    type: String,
  }
});

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
