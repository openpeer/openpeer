// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { siweServer } from 'utils/siweServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ token: string }>) {
	const session = await siweServer.getSession(req, res);

	if (!session.address) {
		return res.status(200).json({ token: '' });
	}

	const { address } = session;
	const iat = Math.floor(Date.now() / 1000);
	const exp = iat + 60 * 60 * 24;
	const token = jwt.sign(
		{ sub: address, iat, exp },
		Buffer.from(process.env.KNOCK_SIGNING_KEY!, 'base64').toString('utf-8'),
		{
			algorithm: 'RS256'
		}
	);

	try {
		return res.status(200).json({ token });
	} catch (err) {
		return res.status(500).json({ token: '' });
	}
}
