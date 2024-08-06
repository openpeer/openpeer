// components/TelegramConnect.tsx

import React, { useEffect, useRef } from 'react';
import { TelegramUser } from '../models/telegram';

interface TelegramConnectProps {
	onTelegramAuth: (user: TelegramUser) => void;
	isConnected: boolean;
	buttonSize?: 'small' | 'medium' | 'large';
	showUserPic?: boolean;
}

declare global {
	interface Window {
		TelegramLoginWidget: any;
	}
}

const TelegramConnect: React.FC<TelegramConnectProps> = ({
	onTelegramAuth,
	isConnected,
	buttonSize = 'large',
	showUserPic = true
}) => {
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
				widget.setAttribute('data-size', buttonSize);
				widget.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
				widget.setAttribute('data-request-access', 'write');
				if (showUserPic) {
					widget.setAttribute('data-userpic', 'true');
				}
				widget.async = true;

				buttonRef.current?.appendChild(widget);
			};
			document.body.appendChild(script);

			return () => {
				document.body.removeChild(script);
			};
		}
		return () => {};
	}, [isConnected, onTelegramAuth, buttonSize, showUserPic]);

	if (isConnected) {
		return null;
	}

	return <div className="mt-2" ref={buttonRef} />;
};

export default TelegramConnect;
