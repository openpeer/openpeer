// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { Airdrop } from '../../models/types';
import { minkeApi } from './utils/utils';

const fetchAirdrop = async (address: `0x${string}`, round: number): Promise<Airdrop[]> => {
	const { data } = await minkeApi.get(`/airdrop/${address}/${round}`);
	return data;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Airdrop[]>) {
	const {
		query: { address, round }
	} = req;
	try {
		const result = await fetchAirdrop(address as `0x${string}`, Number(round));
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json([]);
	}
}
