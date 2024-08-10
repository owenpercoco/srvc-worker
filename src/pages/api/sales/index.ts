import type { NextApiRequest, NextApiResponse } from 'next';
import Sale from '@/models/Sale';
import connect from '@/utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect();

  if (req.method === 'GET') {
    try {
      const sales = await Sale.find().lean();
      res.status(200).json({ sales });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sales' });
    }
  } else if (req.method === 'POST') {
    try {
      const { telephone, products } = req.body;

      if (!telephone || !Array.isArray(products)) {
        return res.status(400).json({ error: 'Telephone and products are required' });
      }

      const newSale = new Sale({
        telephone,
        products,
        timestamp: new Date(), // Automatically set the timestamp
      });

      await newSale.save();
      res.status(201).json({ success: true, data: newSale });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create sale' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
