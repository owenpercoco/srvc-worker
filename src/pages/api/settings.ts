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

  switch (req.method) {
    case 'GET':
      try {
        const settings = await PageSettings.findOne({});
        
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
        const { isTelegramLinkVisible, isPhoneNumberVisisble, minimums } = req.body;
        console.log("settings: ", { isTelegramLinkVisible, isPhoneNumberVisisble, minimums });
        // Validation
        if (
          isTelegramLinkVisible === undefined ||
          isPhoneNumberVisisble === undefined
        ) {
          res.status(400).json({ success: false, error: 'Missing required fields' });
          return;
        }

        const updatedSettings = await PageSettings.findOneAndUpdate(
          {},
          { isTelegramLinkVisible, isPhoneNumberVisisble, minimums },
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
