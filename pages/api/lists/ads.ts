// pages/api/lists/ads.ts
import { List, User } from 'models/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { minkeApi } from '../utils/utils';
import { getUserRelationshipsFromApi } from '../user_relationships/index';

// Utility function to extract the token from the Authorization header
const getTokenFromHeader = (headers: NextApiRequest['headers']): string | null => {
	const authHeader = headers.authorization;
	if (authHeader && authHeader.startsWith('Bearer ')) {
		return authHeader.substring(7);
	}
	return null;
};

const fetchLists = async (token: string): Promise<List[]> => {
	const { data } = await minkeApi.get('/list_management', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<List[] | { error: string }>) {
	const { method, headers } = req;
	const token = getTokenFromHeader(headers);

	if (!token) {
		return res.status(401).json({ error: 'Unauthorized: Missing token' });
	}

	try {
		switch (method) {
			case 'GET': {
				const lists = await fetchLists(token);

				// Fetch blocked users
				const userRelationships = await getUserRelationshipsFromApi(token);
				if (!userRelationships) {
					return res.status(500).json({ error: 'Failed to fetch user relationships' });
				}
				const blockedUsers = userRelationships.blocked_users.map((user) => user.id);

				const filteredLists = lists.filter((list) => {
					const ownerId = list.seller?.id;

					if (!ownerId) {
						// Exclude lists without a valid owner ID
						return false;
					}
					return !blockedUsers.includes(ownerId);
				});

				res.status(200).json(filteredLists);
				break;
			}
			default:
				res.setHeader('Allow', ['GET']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (err) {
		console.error('Error fetching lists:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}
