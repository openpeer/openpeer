// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse<boolean>) {
	const {
		query: { address },
		body: { token }
	} = req;

	try {
		if (token) {
			// @ts-expect-error
			const { verified_credentials: credentials, exp } = jwt.verify(
				token as string,
				process.env.TRON_AUTH_PRIVATE_KEY!
			);
			const { address: verifiedAddress } = credentials[0];

			res.status(200).json(address === verifiedAddress && exp > Date.now() / 1000);
		} else {
			res.status(401).json(false);
		}
	} catch (err) {
		console.error(err);
		res.status(500).json(false);
	}
}
