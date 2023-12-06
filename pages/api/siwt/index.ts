// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// @ts-expect-error
import TronWeb from 'tronweb';

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ [address: string]: string } | null>) {
	const { signature, message } = req.body;

	// verify signature for tron

	const tronWeb = new TronWeb({
		fullHost: 'https://api.trongrid.io'
	});

	try {
		const address = await tronWeb.trx.verifyMessageV2(message, signature);

		const token = jwt.sign(
			{ verified_credentials: [{ address }], exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
			process.env.TRON_AUTH_PRIVATE_KEY!,
			{
				algorithm: 'HS256'
			}
		);
		res.status(200).json({ [address]: token });
	} catch (err) {
		console.error(err);
		res.status(500).json(null);
	}
}
