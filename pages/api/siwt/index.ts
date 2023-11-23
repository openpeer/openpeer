// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
// @ts-expect-error
import TronWeb from 'tronweb';

export default async function handler(req: NextApiRequest, res: NextApiResponse<boolean>) {
	const { signature } = req.body;
	const tronWeb = new TronWeb({
		fullHost: 'https://api.trongrid.io'
	});
	try {
		const result = await fetchBanks(req.query);
		res.status(200).json(result);
	} catch (err) {
		res.status(500).json(false);
	}
}
