// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

interface JWTPayload {
	verified_credentials: {
		address: string;
	}[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ token: string }>) {
	const { headers } = req;

	// convert the public key to base64 format
	const publicKeyBase64 = process.env.NEXTAUTH_SECRET!;
	const publicKey = atob(publicKeyBase64);

	jwt.verify(headers.authorization!.split(' ')[1], publicKey, (_, decodedToken) => {
		if (!decodedToken) {
			return res.status(200).json({ token: '' });
		}

		const { verified_credentials: verifiedCredentials } = decodedToken as JWTPayload;
		const { address } = verifiedCredentials[0];
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
	});
}
