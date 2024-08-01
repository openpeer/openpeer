// pages/api/verify-telegram-auth.ts

import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}
	try {
		const { hash, ...userData } = req.body;

		if (!BOT_TOKEN) {
			throw new Error('BOT_TOKEN is not set');
		}

		// console.log('Received user data:', userData);

		const dataCheckString = Object.keys(userData)
			.sort()
			.map((key) => `${key}=${userData[key]}`)
			.join('\n');

		// console.log('Data check string:', dataCheckString);

		const secretKey = crypto.createHash('sha256').update(BOT_TOKEN).digest();
		const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

		// console.log('Calculated hash:', calculatedHash);
		// console.log('Received hash:', hash);

		if (calculatedHash !== hash) {
			return res.status(401).json({ error: 'Invalid authentication' });
		}

		// Authentication successful
		res.status(200).json({
			chatId: userData.id,
			username: userData.username || `${userData.first_name}${userData.last_name ? ` ${userData.last_name}` : ''}`
		});
	} catch (error) {
		console.error('Error in verify-telegram-auth:', error);
		res.status(500).json({ error: 'Internal server error during Telegram authentication' });
	}
}
