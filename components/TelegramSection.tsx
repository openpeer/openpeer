// components/TelegramSection.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Button } from 'components';

interface TelegramSectionProps {
	telegramUserId: string;
	telegramUsername: string;
	telegramBotLink: string;
	setTelegramUserId: (id: string) => void;
	setTelegramUsername: (username: string) => void;
	updateProfile: () => void;
	deleteTelegramInfo: () => Promise<void>;
	refreshUserProfile: () => Promise<void>;
}

const TelegramSection: React.FC<TelegramSectionProps> = ({
	telegramUserId,
	telegramUsername,
	telegramBotLink,
	setTelegramUserId,
	setTelegramUsername,
	updateProfile,
	deleteTelegramInfo,
	refreshUserProfile
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isActivationDisabled, setIsActivationDisabled] = useState(false);
	const isTelegramConnected = !!telegramUserId;

	const checkTelegramStatus = useCallback(async () => {
		if (!isTelegramConnected) {
			await refreshUserProfile();
			setIsActivationDisabled(false);
		}
	}, [isTelegramConnected, refreshUserProfile]);

	useEffect(() => {
		const intervalId = setInterval(checkTelegramStatus, 5000); // Check every 5 seconds
		return () => clearInterval(intervalId);
	}, [checkTelegramStatus]);

	const handleActivateTelegram = () => {
		setIsActivationDisabled(true);
		window.open(telegramBotLink, '_blank');
	};

	const handleDeleteTelegram = async () => {
		try {
			setIsLoading(true);
			await deleteTelegramInfo();
			setTelegramUserId('');
			setTelegramUsername('');
			toast.success('Telegram account disconnected successfully!');
			await refreshUserProfile();
		} catch (error) {
			console.error('Error deleting Telegram info:', error);
			toast.error('Failed to disconnect Telegram account');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			{isTelegramConnected ? (
				<>
					<div className="flex items-center bg-gray-100 p-2 justify-between rounded my-4">
						<div className="flex items-center">
							<span className="font-bold mr-2">Telegram:</span>
							<span>
								@{telegramUsername} ({telegramUserId})
							</span>
						</div>
						<div className="w-20 p-0">
							<Button
								onClick={handleDeleteTelegram}
								aria-label="Delete Telegram info"
								disabled={isLoading}
								title={
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
										<path
											fillRule="evenodd"
											d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
											clipRule="evenodd"
										/>
									</svg>
								}
							/>
						</div>
					</div>
				</>
			) : (
				<div className="mt-4">
					<Button
						title="Activate Telegram Notifications"
						onClick={handleActivateTelegram}
						disabled={isActivationDisabled || isLoading}
					/>
				</div>
			)}
		</div>
	);
};

export default TelegramSection;
