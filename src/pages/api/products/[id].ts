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
  try {
    const {
      name,
      description,
      long_description,
      subtitle,
      type,
      price,
      amount,
      is_in_stock,
      category,
      image,
      amount_in_stock,
    } = req.body;

    const updateData: any = {};

    if (name !== undefined && name !== "") updateData.name = name;
    if (description !== undefined && description !== "") updateData.description = description;
    if (long_description !== undefined && long_description !== "") updateData.long_description = long_description;
    if (subtitle !== undefined && subtitle !== "") updateData.subtitle = subtitle;
    if (type !== undefined && type !== "") updateData.type = type;
    if (price !== undefined && price !== "") updateData.price = price;
    if (amount !== undefined && amount !== "") updateData.amount = amount;
    if (is_in_stock !== undefined) updateData.is_in_stock = is_in_stock; // Allow false
    if (amount_in_stock !== undefined && amount_in_stock !== "") updateData.amount_in_stock = amount_in_stock;
    if (category !== undefined && category !== "") updateData.category = category;
    if (image !== undefined && image !== "") updateData.image = image;

    console.log("update data", updateData);

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, error: "Failed to update product" });
  }
};


// Handle DELETE request
const handleDeleteRequest = async (id: string | string[], res: NextApiResponse<Data>) => {
  console.log('id to find')
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    console.log("heres deletion", deletedProduct);
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
