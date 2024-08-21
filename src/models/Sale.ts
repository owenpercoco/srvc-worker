import mongoose, { Document, Model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Define the interface for the Price schema
interface IPrice {
  amount: number;
  quantity: number;
  description?: string;
  name?: string;
}

// Define the interface for the Sale model
interface ISale extends Document {
  id: string;
  uuid: string;
  telephone: string;
  address?: string;
  orders: IPrice[];
  total: number;
  timestamp: Date;
  confirmed: boolean;
  description?: string;
}

// Define the Price schema
const PriceSchema: Schema<IPrice> = new Schema<IPrice>({
  amount: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  name: {
    type: String,
  },
}, { _id: false });

// Define the Sale schema
const SaleSchema: Schema<ISale> = new Schema<ISale>({
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
  telephone: {
    type: String,
    required: true,
    validate: {
      validator: function(value: string) {
        return /^\+?[1-9]\d{1,14}$/.test(value);
      },
      message: 'Invalid telephone number format',
    },
  },
  orders: {
    type: [PriceSchema],
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  total: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
});

// Create the Sale model
const Sale: Model<ISale> = mongoose.models.Sale || mongoose.model<ISale>('Sale', SaleSchema);
export default Sale;
