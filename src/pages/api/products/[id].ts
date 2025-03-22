import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../../utils/db';
import Product from '../../../models/Product';

type Data = {
  success: boolean;
  data?: any;
  error?: string;
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


    const updatedProduct = await Product.findById(id);
    console.log("heres product to update: ", updatedProduct, updateData)
    if (!updatedProduct) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }
    
    const result = await Product.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: "Failed to update product" });
  }
};

// Main handler function
const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await connect();

  const { id } = req.query;

  if (req.method === 'PUT') {
    await handlePutRequest(id as string, req, res);
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
