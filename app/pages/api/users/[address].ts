// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from 'models/types';

import { minkeApi } from '../utils/utils';

import type { NextApiRequest, NextApiResponse } from 'next';

const updateUser = async (address: string, body: NextApiRequest['body']): Promise<User> => {
	const { data } = await minkeApi.patch(`/users/${address}`, body);
	return data;
};

const fetchUser = async (address: string): Promise<User> => {
	const { data } = await minkeApi.get(`/users/${address}`);
	return data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<User>) {
	const { query, method, body } = req;
	const { address } = query;

	switch (method) {
		case 'PUT':
			res.status(200).json(await updateUser(address as string, body));
			break;
		case 'GET':
			res.status(200).json(await fetchUser(address as string));
			break;
		default:
			res.setHeader('Allow', ['PUT', 'GET']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
