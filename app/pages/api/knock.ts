// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ token: string }>) {
	const session = await getSession({ req });

	if (!session) {
		return res.status(200).json({ token: '' });
	}

	// @ts-ignore
	const { sub, iat, exp } = session.token;
	const token = jwt.sign({ sub, iat, exp }, Buffer.from(process.env.KNOCK_SIGNING_KEY!, 'base64').toString('utf-8'), {
		algorithm: 'RS256'
	});

	try {
		res.status(200).json({ token });
	} catch (err) {
		res.status(500).json({ token: '' });
	}
}
