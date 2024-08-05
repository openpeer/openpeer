// components/TelegramConnect.tsx

import React, { useEffect, useRef } from 'react';

interface TelegramConnectProps {
	onTelegramAuth: (user: TelegramUser) => void;
	isConnected: boolean;
}

interface TelegramUser {
	id: number;
	first_name: string;
	username?: string;
	photo_url?: string;
	auth_date: number;
	hash: string;
}

declare global {
	interface Window {
		TelegramLoginWidget: any;
	}
}

const TelegramConnect: React.FC<TelegramConnectProps> = ({ onTelegramAuth, isConnected }) => {
	const buttonRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isConnected) {
			const script = document.createElement('script');
			script.src = 'https://telegram.org/js/telegram-widget.js?22';
			script.async = true;
			script.onload = () => {
				window.TelegramLoginWidget = {
					dataOnauth: (user: TelegramUser) => onTelegramAuth(user)
				};

				const widget = document.createElement('script');
				widget.setAttribute('data-telegram-login', 'openpeer_bot');
				widget.setAttribute('data-size', 'large');
				widget.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
				widget.setAttribute('data-request-access', 'write');
				widget.async = true;

				buttonRef.current?.appendChild(widget);
			};
			document.body.appendChild(script);

			return () => {
				document.body.removeChild(script);
			};
		}
	}, [isConnected, onTelegramAuth]);

	if (isConnected) {
		return;
	}

	return <div className="mt-2" ref={buttonRef} />;
};

export default TelegramConnect;
