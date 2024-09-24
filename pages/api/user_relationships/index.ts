import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'models/types';
import { minkeApi } from '../utils/utils';

const getUserRelationshipsFromApi = async (
	address: string
): Promise<{ trusted_users: User[]; blocked_users: User[]; blocked_by_users: User[] }> => {
	const { data } = await minkeApi.get('/user_relationships', {
		headers: {
			'X-User-Address': address
		}
	});
	return data.data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method, query } = req;
	const address = req.headers['x-user-address'] as string;

	if (!address) {
		return res.status(401).json({ error: 'Unauthorized: Missing user address' });
	}

	try {
		switch (method) {
			case 'GET':
				const relationships = await getUserRelationshipsFromApi(address);
				res.status(200).json(relationships);
				break;
			default:
				res.setHeader('Allow', ['GET']);
				res.status(405).end(`Method ${method} Not Allowed`);
		}
	} catch (error) {
		console.error('Error in user_relationships API:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

export { getUserRelationshipsFromApi };
