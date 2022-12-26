// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Token } from '../../models/types';
import { minkeApi } from './utils/utils';

import type { NextApiRequest, NextApiResponse } from 'next';
const fetchTokens = async (): Promise<Token[]> => {
  const { data } = await minkeApi.get('/tokens', { params: { chain_id: 80001 } });
  return data;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Token[]>
) {
  try {
    const result = await fetchTokens();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json([]);
  }
}
