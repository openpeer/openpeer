// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { FiatCurrency } from '../../models/types';
import { minkeApi } from './utils/utils';

import type { NextApiRequest, NextApiResponse } from 'next';
const fetchCurrencies = async (): Promise<FiatCurrency[]> => {
  const { data } = await minkeApi.get('/currencies', { params: { chain_id: 80001 } });
  return data;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FiatCurrency[]>
) {
  try {
    const result = await fetchCurrencies();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json([]);
  }
}
