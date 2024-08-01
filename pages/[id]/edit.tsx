// pages/[id]/edit.tsx
import { Avatar, Button, HeaderH3, Input, Loading } from 'components';
import ImageUploader from 'components/ImageUploader';
import { useUserProfile, useAccount } from 'hooks';
import { GetServerSideProps } from 'next';
import ErrorPage from 'next/error';
import React from 'react';
import { toast } from 'react-toastify';
import TelegramConnect from '../../components/TelegramConnect';

const EditProfile = ({ id }: { id: `0x${string}` }) => {
	const { address } = useAccount();
	const onUpdateProfile = () => {
		toast.success('Done', {
			theme: 'dark',
			position: 'top-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: false,
			progress: undefined
		});
	};
	const {
		user,
		onUploadFinished,
		updateProfile,
		errors,
		username,
		setUsername,
		email,
		setEmail,
		twitter,
		setTwitter,
		telegramUserId,
		setTelegramUserId,
		telegramUsername,
		setTelegramUsername,
		whatsappCountryCode,
		setWhatsappCountryCode,
		whatsappNumber,
		setWhatsappNumber
	} = useUserProfile({ onUpdateProfile });

	if (user === undefined) {
		return <Loading />;
	}
	if (user === null || id !== address) {
		return <ErrorPage statusCode={404} />;
	}

	const handleTelegramAuth = async (user: TelegramUser) => {
		try {
			const response = await fetch('/api/tg/verify-telegram-auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			});

			if (response.ok) {
				const { chatId, username } = await response.json();
				setTelegramUserId(chatId.toString());
				setTelegramUsername(username);
				toast.success('Telegram account connected successfully!');
			} else {
				const errorText = await response.text();
				console.error('Error response:', errorText);
				toast.error(`Failed to connect Telegram account: ${response.status} ${response.statusText}`);
			}
		} catch (error) {
			console.error('Error during Telegram authentication:', error);
			toast.error('An error occurred during Telegram authentication');
		}
	};

	const isTelegramConnected = !!telegramUserId;

	return (
		<div className="w-full m-auto flex flex-col sm:flex-row px-8 py-4 gap-x-16 justify-center mt-8">
			<div className="w-full md:w-80 mb-8">
				<div className="flex items-start">
					<div className="w-48">
						<Avatar user={user} className="w-20 h-20" />
					</div>
					<div className="ml-3">
						<div className="font-medium text-gray-600 group-hover:text-gray-900 mb-6">
							<p className="text-sm">Profile photo</p>
							<p className="text-xs">We recommend an image of at least 400x400. Gifs work too 🙌</p>
						</div>
						<ImageUploader address={address} onUploadFinished={onUploadFinished} />
					</div>
				</div>
			</div>
			<div className="w-full md:w-80">
				<div className="mb-2">
					<HeaderH3 title="Account info" />
					<Input label="Username" id="username" value={username} onChange={setUsername} error={errors.name} />
					<Input
						label="Email Address"
						id="email"
						value={email}
						onChange={setEmail}
						type="email"
						error={errors.email}
					/>
				</div>
				<div className="mb-2">
					<HeaderH3 title="Social" />
					<Input label="Twitter" id="twitter" value={twitter} onChange={setTwitter} />
				</div>
				<div className="mb-2">
					<HeaderH3 title="Messaging" />
					<Input
						label="Telegram User ID"
						id="telegramUserId"
						value={telegramUserId}
						onChange={setTelegramUserId}
						type="number"
					/>
					<Input
						label="Telegram Username"
						id="telegramUsername"
						value={telegramUsername}
						onChange={setTelegramUsername}
					/>
					<Input
						label="WhatsApp Country Code"
						id="whatsappCountryCode"
						value={whatsappCountryCode}
						onChange={setWhatsappCountryCode}
					/>
					<Input
						label="WhatsApp Number"
						id="whatsappNumber"
						value={whatsappNumber}
						onChange={setWhatsappNumber}
					/>
					<TelegramConnect onTelegramAuth={handleTelegramAuth} isConnected={isTelegramConnected} />
				</div>
				<div>
					<Button title="Update profile" onClick={updateProfile} />
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => ({
	props: { title: 'Edit Profile', id: String(context.params?.id) }
});

export default EditProfile;
