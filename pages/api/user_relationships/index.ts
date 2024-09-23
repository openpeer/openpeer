// pages/api/user_relationships/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'models/types';
import { minkeApi } from '../utils/utils';

// Load the API key from the environment variables
const API_KEY = process.env.OPENPEER_API_KEY;

if (!API_KEY) {
	throw new Error('OPENPEER_API_KEY is not defined in the environment variables.');
}

const getUserRelationshipsFromApi = async (
	address: string
): Promise<{ trusted_users: User[]; blocked_users: User[] }> => {
	const { data } = await minkeApi.get('/user_relationships', {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			'X-User-Address': address
		}
	});
	return data.data;
};

const addTrustedUser = async (address: string, targetUserId: string): Promise<{ message: string }> => {
	const { data } = await minkeApi.post(`/user_relationships/trusted/${targetUserId}`, null, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			'X-User-Address': address
		}
	});
	return data.data;
};

const removeTrustedUser = async (address: string, targetUserId: string): Promise<{ message: string }> => {
	const { data } = await minkeApi.delete(`/user_relationships/trusted/${targetUserId}`, {
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			'X-User-Address': address
		}
	});
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method, query } = req;
	const address = req.headers['x-user-address'] as string;

	if (!address) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	try {
		switch (method) {
			case 'GET':
				const relationships = await getUserRelationshipsFromApi(address);
				res.status(200).json(relationships);
				break;
			case 'POST':
				if (query.relationship_type && query.target_user_id) {
					const result = await addTrustedUser(address, query.target_user_id as string);
					res.status(200).json(result);
				} else {
					res.status(400).json({ error: 'Invalid relationship type or missing target user ID' });
				}
				break;
			case 'DELETE':
				if (query.relationship_type && query.target_user_id) {
					const result = await removeTrustedUser(address, query.target_user_id as string);
					res.status(200).json(result);
				} else {
					res.status(400).json({ error: 'Invalid relationship type or missing target user ID' });
				}
				break;
			default:
				res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (error) {
		console.error('Error in user_relationships API:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

export { getUserRelationshipsFromApi };
