// pages/api/lists/ads.ts
import { List } from 'models/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { minkeApi } from '../utils/utils';
import { getUserRelationshipsFromApi } from '../user_relationships/index';

// Utility function to extract the user's address from the headers
const getUserAddressFromHeader = (headers: NextApiRequest['headers']): string | null => {
	return headers['x-user-address'] as string | null;
};

// Utility function to extract the authorization token from the headers
const getAuthorizationTokenFromHeader = (headers: NextApiRequest['headers']): string | null => {
	const authHeader = headers.authorization;
	if (authHeader && authHeader.startsWith('Bearer ')) {
		return authHeader.substring(7);
	}
	return null;
};

const fetchLists = async (address: string, token: string): Promise<List[]> => {
	try {
		const response = await minkeApi.get('/list_management', {
			headers: {
				Authorization: `Bearer ${token}`,
				'X-User-Address': address
			}
		});

		// Check if the response structure is correct
		if (!response || !response.data || !Array.isArray(response.data.data)) {
			console.error('Unexpected response structure from fetchLists:', response);
			return []; // Return an empty array if the response is not as expected
		}

		const lists = response.data.data;

		// Fetch user relationships to get blocked users
		const userRelationships = await getUserRelationshipsFromApi(address);
		if (!userRelationships) {
			console.error('Failed to fetch user relationships');
			return [];
		}

		const blockedUsers = userRelationships.blocked_users.map((user) => user.id);
		const trustedUsers = userRelationships.trusted_users.map((user) => user.id);

		// Filter lists to exclude those owned by blocked users and ensure trusted users can see the ad
		const filteredLists = lists.filter((list: List) => {
			const ownerId = list.seller?.id;
			const isTrustedOnly = list.accept_only_trusted;
			const isOwnerTrusted = trustedUsers.includes(ownerId);

			if (!ownerId) {
				return false;
			}

			if (blockedUsers.includes(ownerId)) {
				return false;
			}

			if (isTrustedOnly && !isOwnerTrusted) {
				return false;
			}

			return true;
		});

		return filteredLists;
	} catch (error) {
		console.error('Error fetching lists:', error);
		return [];
	}
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<List[] | { error: string }>) {
	const { method, headers } = req;
	// console.log('Received headers:', headers);
	const address = getUserAddressFromHeader(headers);
	const token = getAuthorizationTokenFromHeader(headers);

	if (!address || !token) {
		return res.status(401).json({ error: 'Unauthorized: Missing user address or token' });
	}

	try {
		switch (method) {
			case 'GET': {
				// Fetch lists with correct headers
				const lists = await fetchLists(address, token);
				// console.log('Fetched lists:', lists); // Debug log to check the structure of lists

				// Fetch user relationships with correct headers
				const userRelationships = await getUserRelationshipsFromApi(address);
				if (!userRelationships) {
					return res.status(500).json({ error: 'Failed to fetch user relationships' });
				}

				const blockedUsers = userRelationships.blocked_users.map((user) => user.id);

				// Filter lists to exclude those owned by blocked users
				const filteredLists = Array.isArray(lists)
					? lists.filter((list: List) => {
							const ownerId = list.seller?.id;
							if (!ownerId) {
								// Exclude lists without a valid owner ID
								return false;
							}
							return !blockedUsers.includes(ownerId);
					  })
					: [];

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
