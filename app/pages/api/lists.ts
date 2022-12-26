// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { List } from '../../models/types';
import { minkeApi } from './utils/utils';

import type { NextApiRequest, NextApiResponse } from 'next';
const fetchLists = async (): Promise<List[]> => {
  const { data } = await minkeApi.get('/lists', { params: { chain_id: 80001 } });
  return data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<List[]>) {
  try {
    const result = await fetchLists();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json([]);
  }
}
