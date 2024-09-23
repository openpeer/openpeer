import React, { useEffect, useState } from 'react';
import Input from 'components/Input/Input';
import Label from 'components/Label/Label';
import Loading from 'components/Loading/Loading';
import TelegramSection from 'components/TelegramSection';
import StepLayout from './StepLayout';
import { useUserProfile } from 'hooks';
import { User } from 'models/types';

interface AccountInfoProps {
	setUser: (user: User) => void;
}

const AccountInfo: React.FC<AccountInfoProps> = ({ setUser }) => {
	const { user, updateProfile, errors, deleteTelegramInfo, telegramBotLink, refreshUserProfile } = useUserProfile({
		onUpdateProfile: setUser
	});

	const [username, setUsername] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [telegramUserId, setTelegramUserId] = useState<string>('');
	const [telegramUsername, setTelegramUsername] = useState<string>('');

	useEffect(() => {
		if (user) {
			setUsername(user.name || '');
			setEmail(user.email || '');
			setTelegramUserId(user.telegram_user_id || '');
			setTelegramUsername(user.telegram_username || '');
		}
	}, [user]);

	if (user === undefined) {
		return <Loading />;
	}

	const handleUpdateProfile = () => {
		updateProfile({
			name: username,
			email: email,
			telegram_user_id: telegramUserId,
			telegram_username: telegramUsername
		});
	};

	return (
		<StepLayout onProceed={handleUpdateProfile}>
			<div className="my-8">
				<Label title="Set your account info to receive notifications" />
				<Input
					placeholder="@satoshi"
					label="Username"
					id="username"
					value={username}
					onChange={(value: string) => setUsername(value)}
					error={errors.name}
				/>
				<Input
					placeholder="satoshi@bitcoin.org"
					label="Email Address"
					id="email"
					type="email"
					value={email}
					onChange={(value: string) => setEmail(value)}
					error={errors.email}
				/>
				<label className="block text-base font-medium text-gray-700 mb-1">Telegram Notifications</label>
				<TelegramSection
					telegramUserId={telegramUserId}
					telegramUsername={telegramUsername}
					telegramBotLink={telegramBotLink}
					setTelegramUserId={setTelegramUserId}
					setTelegramUsername={setTelegramUsername}
					updateProfile={updateProfile}
					deleteTelegramInfo={deleteTelegramInfo}
					refreshUserProfile={refreshUserProfile}
				/>
			</div>
		</StepLayout>
	);
};

export default AccountInfo;
