// pages/api/tg/connect.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../utils/session';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	const session = await getSession(req);
	if (!session) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const { telegramChatId } = req.body;

	try {
		const updatedUser = await prisma.user.update({
			where: { id: session.user.id },
			data: { telegramChatId }
		});

		res.status(200).json({ message: 'Telegram chat ID stored successfully', user: updatedUser });
	} catch (error) {
		res.status(500).json({ message: 'Error storing Telegram chat ID', error });
	}
}
