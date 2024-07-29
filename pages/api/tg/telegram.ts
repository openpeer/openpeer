import type { NextApiRequest, NextApiResponse } from 'next';
import { sendTelegramNotification } from '../../../utils/telegramNotifications';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === 'POST') {
		const { message } = req.body;
		try {
			const result = await sendTelegramNotification(message);
			res.status(200).json({ success: true, result });
		} catch (error) {
			if (error instanceof Error) {
				res.status(500).json({ success: false, error: error.message });
			} else {
				res.status(500).json({ success: false, error: 'An unknown error occurred' });
			}
		}
	} else {
		res.setHeader('Allow', ['POST']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
