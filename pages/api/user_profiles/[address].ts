// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// pages/api/user_profiles/[address].ts
import { User } from 'models/types';

import { minkeApi } from '../utils/utils';

// eslint-disable-next-line import/order
import type { NextApiRequest, NextApiResponse } from 'next';

const fetchUser = async (address: string, token: string): Promise<User> => {
	const { data } = await minkeApi.get(`/user_profiles/${address}`, {
		headers: {
			Authorization: token
		}
	});
	return data.data;
};

const updateUser = async (address: string, body: NextApiRequest['body'], token: string): Promise<User> => {
	const { data } = await minkeApi.patch(`/user_profiles/${address}`, body, {
		headers: {
			Authorization: token
		}
	});
	return data.data;
};

const verifyUser = async (chainId: string, token: string): Promise<User> => {
	const { data } = await minkeApi.post(
		`/user_profiles/verify/${chainId}`,
		{},
		{
			headers: {
				Authorization: token
			}
		}
	);
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<User>) {
	const { query, method, body, headers } = req;
	const { address } = query;

	switch (method) {
		case 'GET':
			res.status(200).json(await fetchUser(address as string, headers.authorization!));
			break;
		case 'PUT':
			res.status(200).json(await updateUser(address as string, body, headers.authorization!));
			break;
		case 'POST':
			res.status(200).json(await verifyUser(address as string, headers.authorization!));
			break;
		default:
			res.setHeader('Allow', ['GET', 'PUT']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
