// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from 'models/types';

import type { NextApiRequest, NextApiResponse } from 'next';
import { minkeApi } from '../utils/utils';

const fetchUser = async (address: string): Promise<User> => {
	const { data } = await minkeApi.get(`/users/${address}`);
	return data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<User>) {
	const { query, method } = req;
	const { address } = query;

	switch (method) {
		case 'GET':
			res.status(200).json(await fetchUser(address as string));
			break;
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
