// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Bank } from '../../models/types';
import { minkeApi } from './utils/utils';

import type { NextApiRequest, NextApiResponse } from 'next';
const fetchPaymentMethods = async (params: NextApiRequest['query']): Promise<Bank[]> => {
  const { data } = await minkeApi.get('/payment_methods', { params });
  return data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Bank[]>) {
  try {
    const result = await fetchPaymentMethods(req.query);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json([]);
  }
}
