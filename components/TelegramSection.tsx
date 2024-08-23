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
	const [isChecking, setIsChecking] = useState(false);
	const [countdown, setCountdown] = useState(0);
	const [hasClickedLink, setHasClickedLink] = useState(false);
	const [showAlternativeMethod, setShowAlternativeMethod] = useState(false);
	const [isCheckingAltMethod, setIsCheckingAltMethod] = useState(false);
	const isTelegramConnected = !!telegramUserId;
	const uniqueIdentifier = telegramBotLink.split('=')[1];

	const checkTelegramStatus = useCallback(async () => {
		if (!isTelegramConnected) {
			setIsChecking(true);
			await refreshUserProfile();
			setIsActivationDisabled(false);
			setIsChecking(false);
		}
	}, [isTelegramConnected, refreshUserProfile]);

	useEffect(() => {
		let checkCount = 0;
		let timeoutId: NodeJS.Timeout;
		let countdownId: NodeJS.Timeout;

		const runCheck = async () => {
			if (isTelegramConnected) {
				setHasClickedLink(false);
				setIsCheckingAltMethod(false);
				return;
			}

			await checkTelegramStatus();
			checkCount++;

			if (checkCount < 5) {
				timeoutId = setTimeout(runCheck, 2000);
			} else if (checkCount < 17) {
				setCountdown(10);
				const startCountdown = () => {
					countdownId = setInterval(() => {
						setCountdown((prev) => {
							if (prev <= 1) {
								clearInterval(countdownId);
								return 0;
							}
							return prev - 1;
						});
					}, 1000);
				};
				startCountdown();
				timeoutId = setTimeout(() => {
					clearInterval(countdownId);
					runCheck();
				}, 10000);
			} else {
				setHasClickedLink(false);
				setIsCheckingAltMethod(false);
			}
		};

		if (hasClickedLink || isCheckingAltMethod) {
			runCheck();
		}

		return () => {
			clearTimeout(timeoutId);
			clearInterval(countdownId);
		};
	}, [checkTelegramStatus, hasClickedLink, isTelegramConnected, isCheckingAltMethod]);

	const handleActivateTelegram = () => {
		setIsActivationDisabled(true);
		setHasClickedLink(true);
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
			setHasClickedLink(false);
			setIsActivationDisabled(false);
			setIsChecking(false);
			setCountdown(0);
		}
	};

	const handleToggleAlternativeMethod = () => {
		const newShowAlternativeMethod = !showAlternativeMethod;
		setShowAlternativeMethod(newShowAlternativeMethod);
		if (newShowAlternativeMethod && !isTelegramConnected) {
			setIsCheckingAltMethod(true);
		}
	};

	const renderButtonContent = () => (
		<>
			{(hasClickedLink || isCheckingAltMethod) && (isChecking || countdown > 0) && (
				<svg className="animate-spin h-5 w-5 mr-3 inline" viewBox="0 0 24 24">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
			)}
			<span>
				{!hasClickedLink && !isCheckingAltMethod && 'Activate Telegram Notifications'}
				{(hasClickedLink || isCheckingAltMethod) && isChecking && 'Checking...'}
				{(hasClickedLink || isCheckingAltMethod) &&
					!isChecking &&
					countdown > 0 &&
					`Next check in ${countdown}s`}
				{(hasClickedLink || isCheckingAltMethod) && !isChecking && countdown === 0 && 'Checking...'}
			</span>
		</>
	);

	const getButtonColor = () => {
		if (!hasClickedLink && !isCheckingAltMethod) return undefined; // Use default color
		if (isChecking || countdown > 0) return '#6B7280';
		return '#6B7280'; // gray-500
	};

	const handleCopyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text);
		toast.success('Copied to clipboard!');
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
						onClick={handleActivateTelegram}
						disabled={isActivationDisabled || isLoading}
						title={renderButtonContent()}
						className="py-2 px-4 rounded inline-flex items-center justify-center w-full"
						customBgColor={getButtonColor()}
					/>

					<div className="mt-2 text-center">
						<button
							onClick={handleToggleAlternativeMethod}
							className="text-blue-500 hover:text-blue-700 flex items-center justify-center w-full"
						>
							<svg
								className={`w-4 h-4 mr-1 transition-transform ${
									showAlternativeMethod ? 'rotate-90' : ''
								}`}
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
							Alternative Method
						</button>
					</div>
					{showAlternativeMethod && (
						<div className="mt-2 p-4 bg-gray-100 rounded">
							<ol className="list-decimal list-outside space-y-2 ml-5">
								<li className="pl-1">
									<span className="inline-flex items-center">
										Open Telegram and search for:
										<span className="font-bold mx-1">@openpeer_bot</span>
										<button
											onClick={() => handleCopyToClipboard('@openpeer_bot')}
											className="ml-1 text-blue-500 hover:text-blue-700"
											aria-label="Copy bot name"
										>
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
												/>
											</svg>
										</button>
									</span>
								</li>
								<li className="pl-1">Start a chat with the bot and send this message:</li>
							</ol>
							<div className="flex items-center bg-white p-2 rounded mt-2">
								<code className="flex-grow">/start {uniqueIdentifier}</code>
								<button
									onClick={() => handleCopyToClipboard(`/start ${uniqueIdentifier}`)}
									className="ml-2 text-blue-500 hover:text-blue-700"
								>
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
										/>
									</svg>
								</button>
							</div>
							{isCheckingAltMethod && (
								<div className="mt-2 text-center text-sm text-gray-600">Checking for updates...</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default TelegramSection;
