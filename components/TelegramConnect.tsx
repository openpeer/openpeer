'use client';

import React, { useState } from 'react';

export default function TelegramConnect() {
	const [telegramConnected, setTelegramConnected] = useState(false);
	const [telegramChatId, setTelegramChatId] = useState('');

	const handleTelegramConnect = async () => {
		// Placeholder
		const chatId = '468259635';

		try {
			const response = await fetch('/api/telegram/connect', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ telegramChatId: chatId })
			});

			if (response.ok) {
				setTelegramConnected(true);
				setTelegramChatId(chatId);
			} else {
				throw new Error('Failed to connect Telegram');
			}
		} catch (error) {
			console.error('Error connecting Telegram:', error);
		}
	};

	return (
		<div>
			<h3 className="text-lg font-medium leading-6 text-gray-900">Telegram Integration</h3>
			<div className="mt-2 max-w-xl text-sm text-gray-500">
				<p>Connect your account to receive notifications via Telegram.</p>
			</div>
			<div className="mt-5">
				{telegramConnected ? (
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
						Connected (Chat ID: {telegramChatId})
					</span>
				) : (
					<button
						type="button"
						onClick={handleTelegramConnect}
						className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Connect Telegram
					</button>
				)}
			</div>
		</div>
	);
}
