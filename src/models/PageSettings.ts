import mongoose, { Schema, Document } from "mongoose";

interface DeliveryMinimum {
  name: string;
  value: number;
}

interface PageSettingsDocument extends Document {
  telegramLink: boolean;
  phoneNumber: boolean;
  minimums: DeliveryMinimum[];
}

const DeliveryMinimumSchema = new Schema<DeliveryMinimum>({
  name: { type: String, required: true },
  value: { type: Number, required: true },
});

const PageSettingsSchema = new Schema<PageSettingsDocument>({
  telegramLink: { type: Boolean, required: true },
  phoneNumber: { type: Boolean, required: true },
  minimums: { type: [DeliveryMinimumSchema], required: true },
});

const PageSettings =
  mongoose.models.PageSettings ||
  mongoose.model<PageSettingsDocument>("PageSettings", PageSettingsSchema, "settings");


export default PageSettings;
