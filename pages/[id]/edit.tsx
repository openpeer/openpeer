// pages/[id]/edit.tsx
import { Avatar, Button, HeaderH3, Input, Loading } from 'components';
import Select from 'components/Select/Select';
import ImageUploader from 'components/ImageUploader';
import { useUserProfile, useAccount } from 'hooks';
import { GetServerSideProps } from 'next';
import ErrorPage from 'next/error';
import React from 'react';
import { toast } from 'react-toastify';
import countryCodes from 'utils/countryCodes';
import TelegramConnect from '../../components/TelegramConnect';
import { TelegramUser } from '../../models/telegram';

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
				// await updateProfile();
			} else {
				// const errorText = await response.text();
				// console.error('Error response:', errorText);
				toast.error(`Failed to connect Telegram account: ${response.status} ${response.statusText}`);
			}
		} catch (error) {
			// console.error('Error during Telegram authentication:', error);
			toast.error('An error occurred during Telegram authentication');
		}
	};

	const isTelegramConnected = !!telegramUserId;

	const handleDeleteTelegram = () => {
		setTelegramUserId('');
		setTelegramUsername('');
		toast.success('Telegram account disconnected successfully! Please update your profile.');
	};

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
					{isTelegramConnected && (
						<div className="flex items-center bg-gray-100 p-2 justify-between rounded my-4">
							<div className="flex items-center">
								<span className="font-bold mr-2">Telegram:</span>
								<span>
									@{telegramUsername} ({telegramUserId})
								</span>
							</div>
							<Button
								xyz
								onClick={handleDeleteTelegram}
								aria-label="Delete Telegram info"
								title={
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="size-6"
									>
										<path
											fillRule="evenodd"
											d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
											clipRule="evenodd"
										/>
									</svg>
								}
							/>
						</div>
					)}

					<TelegramConnect onTelegramAuth={handleTelegramAuth} isConnected={isTelegramConnected} />

					<div className="hidden">
						<Input
							label="Telegram ID"
							id="telegramUserId"
							value={telegramUserId}
							type="number"
							onChange={setTelegramUserId}
						/>
						<Input
							label="Telegram Username"
							id="telegramUsername"
							value={telegramUsername}
							onChange={setTelegramUsername}
						/>
					</div>
					<Select
						label="WhatsApp Country Code"
						options={[
							{ id: 0, name: 'Select a country code' },
							...countryCodes.map((country, index) => ({
								id: index + 1,
								name: `${country.name} (+${country.code})`
							}))
						]}
						selected={
							countryCodes.findIndex((c) => c.code === whatsappCountryCode) !== -1
								? {
										id: countryCodes.findIndex((c) => c.code === whatsappCountryCode) + 1,
										name: `${
											countryCodes.find((c) => c.code === whatsappCountryCode)?.name
										} (+${whatsappCountryCode})`
								  }
								: { id: 0, name: 'Select a country code' }
						}
						onSelect={(option) => {
							if (option && option.id !== 0) {
								const selectedCountry = countryCodes[option.id - 1];
								setWhatsappCountryCode(selectedCountry.code);
							} else {
								setWhatsappCountryCode('');
							}
						}}
					/>

					<Input
						label="WhatsApp Number"
						id="whatsappNumber"
						value={whatsappNumber}
						onChange={setWhatsappNumber}
					/>
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
