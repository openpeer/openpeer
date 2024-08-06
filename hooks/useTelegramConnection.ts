// hooks/useTelegramConnection.ts

import { useState } from 'react';
import { toast } from 'react-toastify';
import { TelegramUser } from '../models/telegram';

export const useTelegramConnection = () => {
	const [telegramUserId, setTelegramUserId] = useState('');
	const [telegramUsername, setTelegramUsername] = useState('');

	const handleTelegramAuth = async (telegramUser: TelegramUser) => {
		try {
			const response = await fetch('/api/tg/verify-telegram-auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(telegramUser)
			});

			if (response.ok) {
				const { chatId, username: tgUsername } = await response.json();
				setTelegramUserId(chatId.toString());
				setTelegramUsername(tgUsername);

				toast.success('Telegram account connected successfully! Please update your profile.');
			} else {
				toast.error(`Failed to connect Telegram account: ${response.status} ${response.statusText}`);
			}
		} catch (error) {
			toast.error('An error occurred during Telegram authentication');
		}
	};

	const handleDeleteTelegram = () => {
		setTelegramUserId('');
		setTelegramUsername('');
		toast.success('Telegram account disconnected successfully! Please update your profile.');
	};

	const isTelegramConnected = !!telegramUserId;

	return {
		telegramUserId,
		telegramUsername,
		setTelegramUserId,
		setTelegramUsername,
		handleTelegramAuth,
		handleDeleteTelegram,
		isTelegramConnected
	};
};
