import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the interface for the Sale model
interface ISale extends Document {
  id: string;
  telephone: string;
  products: string[];  
  timestamp: Date;
  confirmed: boolean;
}


const SaleSchema: Schema<ISale> = new Schema<ISale>({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
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
  products: {
    type: [String],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  confirmed: {
    type: Boolean,
    default: false
  }
});

// Create the Sale model
const Sale: Model<ISale> = mongoose.models.Sale || mongoose.model<ISale>('Sale', SaleSchema);
export default Sale;
