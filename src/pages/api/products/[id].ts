import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../utils/db';
import Product from '../../../models/Product';

type Data = {
  success: boolean;
  data?: any;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await connect();

  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const product = await Product.findById(id);
        if (!product) {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.status(200).json({ success: true, data: product });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to load product' });
      }
      break;

    case 'PUT':
        console.log('looking for id: ', id);
        console.log(req.body)
      try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.status(200).json({ success: true, data: updatedProduct });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Failed to update product' });
      }
      break;

    case 'DELETE':
      try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }
        res.status(200).json({ success: true, data: deletedProduct });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to delete product' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
