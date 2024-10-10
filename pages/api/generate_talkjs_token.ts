// pages/api/generate_talkjs_token.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const { user_id } = req.body;
	const secret_key = process.env.TALKJS_SECRET_KEY;
	const app_id = process.env.NEXT_PUBLIC_TALKJS_APP_ID;

	// Log received parameters
	// console.log('Received parameters:', { user_id, secret_key, app_id });

	// console.log('Secret key:', secret_key);
	// console.log('App ID:', app_id);
	// console.log('User ID:', user_id);

	if (!user_id || !secret_key || !app_id) {
		return res.status(400).json({ error: 'Missing parameters' });
	}

	try {
		const token = jwt.sign({ tokenType: 'user' }, secret_key, {
			issuer: app_id,
			subject: String(user_id),
			expiresIn: '1d'
		});
		// console.log(token);

		return res.status(200).json({ token });
	} catch (error) {
		if (error instanceof Error) {
			return res.status(500).json({ error: error.message });
		} else {
			return res.status(500).json({ error: 'An unknown error occurred' });
		}
	}
}
