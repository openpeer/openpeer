import jwt from 'jsonwebtoken';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from 'models/types';
import { siweServer } from 'utils/siweServer';

import { minkeApi } from '../utils/utils';

// eslint-disable-next-line import/order
import type { NextApiRequest, NextApiResponse } from 'next';

const fetchUser = async (address: string, token: string): Promise<User> => {
	const { data } = await minkeApi.get(`/user_profiles/${address}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return data.data;
};

const updateUser = async (address: string, body: NextApiRequest['body'], token: string): Promise<User> => {
	const { data } = await minkeApi.patch(`/user_profiles/${address}`, body, {
		headers: {
			Authorization: `Bearer ${token}`
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
				Authorization: `Bearer ${token}`
			}
		}
	);
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<User>) {
	const { query, method, body } = req;
	const { address } = query;
	const { address: account } = await siweServer.getSession(req, res);
	const encodedToken = jwt.sign(
		{ sub: account, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
		process.env.NEXTAUTH_SECRET!,
		{
			algorithm: 'HS256'
		}
	);

	switch (method) {
		case 'GET':
			res.status(200).json(await fetchUser(address as string, encodedToken));
			break;
		case 'PUT':
			res.status(200).json(await updateUser(address as string, body, encodedToken));
			break;
		case 'POST':
			res.status(200).json(await verifyUser(address as string, encodedToken));
			break;
		default:
			res.setHeader('Allow', ['GET', 'PUT']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
