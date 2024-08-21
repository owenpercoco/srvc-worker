import type { NextApiRequest, NextApiResponse } from 'next';
import Sale from '@/models/Sale';
import connect from '@/utils/db';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

function normalizeTelephone(input: string): string | null {
  const phoneNumber = parsePhoneNumberFromString(input, 'US'); // Default country code 'US'
  
  if (!phoneNumber) {
    console.error(`Failed to parse phone number: ${input}`);
    return null; // Invalid number
  }

  return phoneNumber.formatInternational(); // e.g., +1 234 567 8900
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect();

  if (req.method === 'GET') {
    try {
      const sales = await Sale.find().lean();
      res.status(200).json({ sales });
    } catch (error) {
      console.error('Failed to fetch sales:', error);
      res.status(500).json({ error: 'Failed to fetch sales' });
    }
  } else if (req.method === 'POST') {
    try {
      const { telephone, orders, confirmed, description } = req.body;
      console.log('Received request body:', req.body);

      const normalizedTelephone =  normalizeTelephone(telephone)?.replace(/\s/g, "")
      if (!normalizedTelephone) {
        console.error('Telephone normalization failed');
        return res.status(400).json({ error: 'Invalid telephone number' });
      }

      const total = orders.reduce((acc: number, curr: any) => acc + curr.amount, 0);
      console.log('Calculated total:', total);

      const newSale = new Sale({
        telephone: normalizedTelephone,
        orders,
        total,
        confirmed: confirmed ?? false,
      });
      console.log('New Sale object:', newSale);

      await newSale.save();
      console.log('Sale saved successfully:', newSale);

      res.status(201).json({ success: true, data: newSale });
    } catch (error: any) {
      console.error('Failed to create sale:', error);
      res.status(500).json({ error: 'Failed to create sale', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
