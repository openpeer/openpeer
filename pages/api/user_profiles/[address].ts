// pages/api/user_profiles/[address].ts
import { User } from 'models/types';
import { minkeApi } from '../utils/utils';
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const fetchUser = async (address: string, token: string): Promise<User> => {
	console.log(`Fetching user profile for address: ${address}`);
	console.log('Headers:', { Authorization: `Bearer ${token}` });

	const { data } = await minkeApi.get(`/user_profiles/${address}`, {
		headers: {
			Authorization: `Bearer ${token}`
		},
		timeout: 5000
	});
	return data.data;
};

const updateUser = async (address: string, body: NextApiRequest['body'], token: string): Promise<User> => {
	try {
		const userProfile = body.user_profile;

		// Parse available_from and available_to to integers if they are present
		if (userProfile.available_from !== undefined) {
			userProfile.available_from = parseInt(userProfile.available_from, 10);
			if (isNaN(userProfile.available_from)) {
				throw new Error('Available from must be a valid integer');
			}
		}

		if (userProfile.available_to !== undefined) {
			userProfile.available_to = parseInt(userProfile.available_to, 10);
			if (isNaN(userProfile.available_to)) {
				throw new Error('Available to must be a valid integer');
			}
		}

		const { data } = await minkeApi.patch(`/user_profiles/${address}`, userProfile, {
			headers: {
				Authorization: `Bearer ${token}`,
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
				Authorization: `Bearer ${token}`
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

	const authHeader = headers.authorization;

	if (!authHeader || authHeader === 'Bearer undefined') {
		return res.status(401).json({ error: 'Missing or invalid authorization token' });
	}

	// Extract the token by removing the 'Bearer ' prefix
	const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

	try {
		switch (method) {
			case 'GET':
				res.status(200).json(await fetchUser(address as string, token));
				break;
			case 'PATCH':
				const updatedUser = await updateUser(address as string, body, token);
				res.status(200).json(updatedUser);
				break;
			case 'POST':
				res.status(200).json(await verifyUser(address as string, token));
				break;
			default:
				res.setHeader('Allow', ['GET', 'PATCH', 'POST']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (error) {
		console.error('API Error:', error);

		if (axios.isAxiosError(error)) {
			const status = error.response?.status || 500;
			const errorMessage = error.response?.data?.error || 'Unknown error occurred';
			res.status(status).json({ error: errorMessage, details: error.message });
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
