import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../utils/db';
import Product from '../../../models/Product';

type Data = {
  success: boolean;
  data?: any;
  error?: string;
};

// Handle GET request
const handleGetRequest = async (id: string | string[], res: NextApiResponse<Data>) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to load product' });
  }
};

// Handle PUT request
const handlePutRequest = async (id: string | string[], req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { name, description, subtitle, type, price, amount, quantity, category, image } = req.body;

  try {
    const updateData: any = { name, description, subtitle, type, price, amount, quantity, category, image };
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.status(200).json({ success: true, data: updateData });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to update product' });
  }
};

// Handle DELETE request
const handleDeleteRequest = async (id: string | string[], res: NextApiResponse<Data>) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.status(200).json({ success: true, data: deletedProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
};

// Main handler function
const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await connect();

  const { id } = req.query;

  if (req.method === 'GET') {
    await handleGetRequest(id as string, res);
  } else if (req.method === 'PUT') {
    await handlePutRequest(id as string, req, res);
  } else if (req.method === 'DELETE') {
    await handleDeleteRequest(id as string, res);
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
