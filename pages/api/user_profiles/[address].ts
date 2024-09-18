// pages/api/user_profiles/[address].ts
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { User } from 'models/types';
import { minkeApi } from '../utils/utils';
// eslint-disable-next-line import/order
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const fetchUser = async (address: string, token: string): Promise<User> => {
	const { data } = await minkeApi.get(`/user_profiles/${address}`, {
		headers: {
			Authorization: token
		}
	});
	return data.data;
};

const updateUser = async (address: string, body: NextApiRequest['body'], token: string): Promise<User> => {
	try {
		const { data } = await minkeApi.patch(`/user_profiles/${address}`, body, {
			headers: {
				Authorization: token,
				'Content-Type': 'application/json'
			}
		});
		return data.data;
	} catch (error) {
		console.error('Error updating user:', error);
		throw error;
	}
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

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<User | { error: string; details?: any }>
) {
	const { query, method, body, headers } = req;
	const { address } = query;

	console.log(`Incoming ${method} request for address: ${address}`);
	console.log('Request body:', body);

	if (!headers.authorization) {
		return res.status(401).json({ error: 'Missing authorization token' });
	}

	try {
		switch (method) {
			case 'GET':
				res.status(200).json(await fetchUser(address as string, headers.authorization));
				break;
			case 'PATCH':
				const updatedUser = await updateUser(address as string, body, headers.authorization);
				res.status(200).json(updatedUser);
				break;
			case 'POST':
				res.status(200).json(await verifyUser(address as string, headers.authorization));
				break;
			default:
				res.setHeader('Allow', ['GET', 'PATCH', 'POST']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (error) {
		console.error('API Error:', error);

		if (axios.isAxiosError(error)) {
			const status = error.response?.status || 500;
			const data = error.response?.data;
			res.status(status).json(data);
		} else if (error instanceof Error) {
			res.status(500).json({
				error: 'An error occurred while processing your request',
				details: error.message
			});
		} else {
			res.status(500).json({
				error: 'An unknown error occurred'
			});
		}
	}
}
