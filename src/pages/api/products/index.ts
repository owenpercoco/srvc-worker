import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose'
import connect from '../../../utils/db';
import Product from '../../../models/Product';
import { BaseProduct } from '../../../data/inventory';

type Data = {
  success: boolean;
  data?: any;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await connect();

  switch (req.method) {
    case 'GET':
      try {
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to load products' });
      }
      break;

    case 'POST':
      try {
        const product: BaseProduct = req.body;
        const newProduct = await Product.create({
          id: new mongoose.Types.ObjectId().toString(),
          name: product.name,
          subtitle: product.subtitle,
          description: product.description,
          long_description: product.long_description,
          price: product.price,
          category: product.category,
          type: product.type,
          amount_in_stock: product.amount_in_stock,
          is_in_stock: product.is_in_stock,
        });

        console.log(newProduct)
        await newProduct.save();
        res.status(201).json({ success: true, data: newProduct });
      } catch (error: any) {
        console.error("Mongoose Save Error:", error);
        res.status(400).json({ success: false, error: error.message || "Failed to create product" });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
