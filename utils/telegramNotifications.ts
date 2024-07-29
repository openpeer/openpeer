// utils/telegramNotifications.ts

import axios from 'axios';

const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
	throw new Error('Telegram bot token or chat ID is not defined');
}

export async function sendTelegramNotification(message: string) {
	try {
		const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
		const response = await axios.post(url, {
			chat_id: TELEGRAM_CHAT_ID,
			text: message
		});
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(`Telegram API error: ${error.response?.data?.description || error.message}`);
		}
		throw new Error('Failed to send Telegram notification');
	}
}
