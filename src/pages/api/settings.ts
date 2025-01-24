import type { NextApiRequest, NextApiResponse } from 'next';
import connect from '../../utils/db';
import PageSettings from '../../models/PageSettings';

type Data = {
  success: boolean;
  data?: any;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await connect();
  console.log("hey do we get hur");
  switch (req.method) {
    case 'GET':
      try {
        const settings = await PageSettings.findOne({});
        console.log("settings: ", settings);
        if (!settings) {
          res.status(404).json({ success: false, error: 'Settings not found' });
          return;
        }
        res.status(200).json({ success: true, data: settings });
      } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to load settings' });
      }
      break;

    case 'POST':
      try {
        const { telegramLink, phoneNumber, minimums } = req.body;

        // Validation
        if (
          telegramLink === undefined ||
          phoneNumber === undefined
        ) {
          res.status(400).json({ success: false, error: 'Missing required fields' });
          return;
        }

        const updatedSettings = await PageSettings.findOneAndUpdate(
          {},
          { telegramLink, phoneNumber, minimums },
          { upsert: true, new: true }
        );

        res.status(201).json({ success: true, data: updatedSettings });
      } catch (error) {
        res.status(400).json({ success: false, error: 'Failed to update settings' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
