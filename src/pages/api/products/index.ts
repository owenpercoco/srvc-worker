import type { NextApiRequest, NextApiResponse } from 'next';
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
        const newProduct = await Product.create(product);
        res.status(201).json({ success: true, data: newProduct });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Failed to create product' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
