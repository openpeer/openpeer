// pages/api/lists/ads.ts
import { List } from 'models/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { minkeApi } from '../utils/utils';

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

		// Filter lists to include only ads owned by the user
		const filteredLists = lists.filter((list: List) => {
			const ownerAddress = list.seller?.address;

			if (!ownerAddress) {
				return false;
			}

			// Include only ads where the seller's address matches the user's address
			return ownerAddress === address;
		});

		return filteredLists;
	} catch (error) {
		console.error('Error fetching lists:', error);
		return [];
	}
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<List[] | { error: string }>) {
	const { method, headers } = req;
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

				res.status(200).json(lists);
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
