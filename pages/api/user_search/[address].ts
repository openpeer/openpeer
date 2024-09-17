// pages/api/user_search/[address].ts

import { User } from 'models/types';
import { minkeApi } from '../utils/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

const searchUser = async (address: string): Promise<User> => {
	const { data } = await minkeApi.get(`/user_search/${address}`);
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<User>) {
	const { query, method } = req;
	const { address } = query;

	switch (method) {
		case 'GET':
			try {
				const user = await searchUser(address as string);
				res.status(200).json(user);
			} catch (error) {
				res.status(404).json({ error: 'User not found' } as any);
			}
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
