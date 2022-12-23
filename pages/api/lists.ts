// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

import { List } from '../../models/types';

import type { NextApiRequest, NextApiResponse } from 'next';
const instance = axios.create({
  baseURL: process.env.OPEN_PEER_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Token ${process.env.OPENPEER_API_KEY}`
  }
});

const fetchLists = async (): Promise<List[]> => {
  const { data } = await instance.get('/lists', { params: { chain_id: 80001 } });
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
