import type { NextApiRequest, NextApiResponse } from 'next';
import Sale from '@/models/Sale';
import connect from '@/utils/db';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect();

  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      // Validate the sale ID
      if (!mongoose.Types.ObjectId.isValid(id as string)) {
        return res.status(400).json({ error: 'Invalid sale ID' });
      }

      // Find the sale by ID
      const sale = await Sale.findById(id);

      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }

      // Update the confirmed status
      sale.confirmed = true;

      // Save the updated sale
      const updatedSale = await sale.save();

      // Return the updated sale
      res.status(200).json({ success: true, data: updatedSale });
    } catch (error) {
      console.error('Failed to update sale:', error);
      res.status(500).json({ error: 'Failed to update sale' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
