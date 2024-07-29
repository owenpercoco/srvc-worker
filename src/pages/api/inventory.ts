// src/pages/api/hello.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { mockData, returnData } from '../../data/inventory';
type Data = {
  data: returnData;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ data: mockData });
}
