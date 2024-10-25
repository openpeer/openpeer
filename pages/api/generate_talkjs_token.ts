// pages/api/generate_talkjs_token.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { user_id } = req.body;
	const secret_key = process.env.TALKJS_SECRET_KEY;
	const app_id = process.env.NEXT_PUBLIC_TALKJS_APP_ID;

	if (!user_id) {
		return res.status(400).json({ error: 'user_id is required' });
	}

	if (!secret_key || !app_id) {
		return res.status(500).json({ error: 'Server configuration error' });
	}

	try {
		const token = jwt.sign(
			{
				tokenType: 'user',
				iss: app_id,
				sub: String(user_id),
				exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 hours
			},
			secret_key
		);
		return res.status(200).json({ token });
	} catch (error) {
		console.error('Token generation error:', error);
		return res.status(500).json({ error: 'Failed to generate token' });
	}
}
