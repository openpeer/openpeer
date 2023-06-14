// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from 'models/types';
import { getSession } from 'next-auth/react';

import type { NextApiRequest, NextApiResponse } from 'next';
import { minkeApi } from '../utils/utils';

const fetchUser = async (address: string, token: string): Promise<User> => {
	const { data } = await minkeApi.get(`/user_profiles/${address}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return data;
};

const updateUser = async (address: string, body: NextApiRequest['body'], token: string): Promise<User> => {
	const { data } = await minkeApi.patch(`/user_profiles/${address}`, body, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<User>) {
	const { query, method, body } = req;
	const { address } = query;
	// @ts-ignore
	const { jwt } = await getSession({ req });

	switch (method) {
		case 'GET':
			res.status(200).json(await fetchUser(address as string, jwt));
			break;
		case 'PUT':
			res.status(200).json(await updateUser(address as string, body, jwt));
			break;
		default:
			res.setHeader('Allow', ['GET', 'PUT']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
