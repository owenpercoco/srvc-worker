import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import connect from '../../utils/db';  // Adjust the path if necessary
import mongoose from 'mongoose';

const SecuritySchema = new mongoose.Schema({
  key: { type: String, required: true },
});

const Security = mongoose.models.Security || mongoose.model('Security', SecuritySchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connect();  // Use the existing database connection

  if (req.method === 'POST') {
    const { passKey } = req.body;
    console.log(req.body)
    console.log(passKey)
    try {
      if (!passKey) {
        return res.status(400).json({ success: false, message: 'Passkey is required' });
      }

      console.log('Searching for security record in the database...');
      const securityRecord = await Security.findOne();

      if (!securityRecord) {
        console.error('No passkey found in the database');
        return res.status(500).json({ success: false, message: 'No passkey found in the database' });
      }

      console.log('Found security record, comparing passkeys...');
      const isMatch = await bcrypt.compare(passKey, securityRecord.key);

      if (isMatch) {
        console.log('Passkey is correct');
        return res.status(200).json({ success: true, message: 'Passkey is correct' });
      } else {
        console.log('Passkey is incorrect');
        return res.status(401).json({ success: false, message: 'Passkey is incorrect' });
      }
    } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({ success: false, message: 'Server error', error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
