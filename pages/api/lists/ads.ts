// pages/api/lists/ads.ts
import { List } from 'models/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { minkeApi } from '../utils/utils';
import { getUserRelationshipsFromApi } from '../user_relationships/index';

const fetchLists = async (token: string): Promise<List[]> => {
	const { data } = await minkeApi.get('/list_management', {
		headers: {
			Authorization: token
		}
	});
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<List[] | { error: string }>) {
	const { method, headers } = req;
	const address = headers.authorization?.split(' ')[1];

	if (!address) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	try {
		switch (method) {
			case 'GET':
				const lists = await fetchLists(headers.authorization!);
				const requestingUserId = parseInt(address, 10);

				// Fetch blocked users
				const userRelationships = await getUserRelationshipsFromApi(address);
				if (!userRelationships) {
					return res.status(500).json({ error: 'Failed to fetch user relationships' });
				}
				const blockedUsers = userRelationships.blocked_users.map((user) => user.id);

				const filteredLists = lists.filter((list) => {
					const ownerId = parseInt(list.owner, 10); // Assuming list.owner is the owner's user ID
					return !blockedUsers.includes(ownerId);
				});

				res.status(200).json(filteredLists);
				break;
			default:
				res.setHeader('Allow', ['GET']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (err) {
		console.error('Error fetching lists:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}
