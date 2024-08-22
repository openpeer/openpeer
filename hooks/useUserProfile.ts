// hooks/userUserProfile.ts
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { S3 } from 'aws-sdk';
import { Errors } from 'models/errors';
import { User } from 'models/types';
import { useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';

interface ErrorObject {
	[fieldName: string]: string[];
}

const useUserProfile = ({ onUpdateProfile }: { onUpdateProfile?: (user: User) => void }) => {
	const [user, setUser] = useState<User | null>();
	const [isUpdating, setIsUpdating] = useState(false);
	const [username, setUsername] = useState<string>();
	const [email, setEmail] = useState<string>();
	const [twitter, setTwitter] = useState<string>();
	const [timezone, setTimezone] = useState<string>();
	const [availableFrom, setAvailableFrom] = useState<number>();
	const [availableTo, setAvailableTo] = useState<number>();
	const [weekendOffline, setWeekendOffline] = useState<boolean>();

	const [telegramUserId, setTelegramUserId] = useState<string>('');
	const [telegramUsername, setTelegramUsername] = useState<string>('');
	const [telegramBotLink, setTelegramBotLink] = useState('');
	const [whatsappCountryCode, setWhatsappCountryCode] = useState<string>('');
	const [whatsappNumber, setWhatsappNumber] = useState<string>('');

	const [errors, setErrors] = useState<Errors>({});

	const { address } = useAccount();

	const fetchUserProfile = useCallback(async () => {
		if (!address) return;

		try {
			console.log('Fetching user profile...');
			const res = await fetch(`/api/user_profiles/${address}`, {
				headers: {
					Authorization: `Bearer ${getAuthToken()}`
				}
			});
			const data = await res.json();
			if (data.errors) {
				setUser(null);
			} else {
				setUser(data);
				// new
				setUsername(data.name || '');
				setEmail(data.email || '');
				setTwitter(data.twitter || '');
				setTelegramUserId(data.telegram_user_id || '');
				setTelegramUsername(data.telegram_username || '');
				setWhatsappCountryCode(data.whatsapp_country_code || '');
				setWhatsappNumber(data.whatsapp_number || '');

				const uniqueIdentifier = data?.unique_identifier;
				const botLink = `https://telegram.me/openpeer_bot?start=${uniqueIdentifier}`;
				setTelegramBotLink(botLink);

				console.log('User profile fetched:', data);
			}
		} catch (error) {
			console.error('Error fetching user profile:', error);
		}
	}, [address]);

	useEffect(() => {
		fetchUserProfile();
	}, [address, fetchUserProfile]);

	useEffect(() => {
		if (user) {
			console.log('User updated:', user);
			console.log('Telegram info:', {
				telegramUserId: user.telegram_user_id,
				telegramUsername: user.telegram_username
			});
			setUsername(user.name || '');
			setEmail(user.email || '');
			setTwitter(user.twitter || '');
			setTimezone(user.timezone || undefined);
			setAvailableFrom(user.available_from || undefined);
			setAvailableTo(user.available_to || undefined);
			setWeekendOffline(user.weekend_offline);
			setTelegramUserId(user.telegram_user_id || '');
			setTelegramUsername(user.telegram_username || '');
			setWhatsappCountryCode(user.whatsapp_country_code || '');
			setWhatsappNumber(user.whatsapp_number || '');

			const uniqueIdentifier = user?.unique_identifier;
			const botLink = `https://telegram.me/openpeer_bot?start=${uniqueIdentifier}`;
			setTelegramBotLink(botLink);
		}
	}, [user]);

	const updateUserProfile = async (profile: Partial<User>, showNotification = true) => {
		try {
			setIsUpdating(true);
			const userProfileData = {
				...profile,
				telegram_user_id: profile.telegram_user_id || null,
				telegram_username: profile.telegram_username || null
			};

			console.log('Sending user profile data to API:', userProfileData);

			const result = await fetch(`/api/user_profiles/${address}`, {
				method: 'PUT',
				body: JSON.stringify({ user_profile: userProfileData }),
				headers: {
					Authorization: `Bearer ${getAuthToken()}`,
					'Content-Type': 'application/json'
				}
			});

			const newUser = await result.json();
			console.log('API Response:', newUser);

			if (newUser.id) {
				setUser(newUser);
				if (showNotification) {
					onUpdateProfile?.(newUser);
				}
				console.log('User profile updated:', newUser);
			} else {
				const foundErrors: ErrorObject = newUser.errors;
				Object.entries(foundErrors).map(([fieldName, messages]) => {
					const formattedMessages = messages.map(
						(message) => `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} ${message}`
					);

					setErrors({ ...errors, ...{ [fieldName]: formattedMessages.join(', ') } });
					return formattedMessages;
				});
			}
		} catch (error) {
			console.error('Error updating profile:', error);
		} finally {
			setIsUpdating(false);
		}
	};

	const deleteTelegramInfo = async () => {
		await updateUserProfile({
			telegram_user_id: null,
			telegram_username: null
		});
		await fetchUserProfile();
	};

	const onUploadFinished = async ({ Key: image }: S3.ManagedUpload.SendData) => {
		updateUserProfile({ ...user, ...{ image } } as User, false);
	};

	const updateProfile = () => {
		setErrors({});

		const newUser = {
			...user,
			name: username || null,
			email: email || null,
			twitter: twitter || null,
			telegram_user_id: telegramUserId ? parseInt(telegramUserId, 10) : null,
			telegram_username: telegramUsername || null,
			whatsapp_country_code: whatsappCountryCode || null,
			whatsapp_number: whatsappNumber || null
		};
		console.log('Updating user with:', newUser);
		updateUserProfile(newUser as User);
	};

	return {
		user,
		isUpdating,
		onUploadFinished,
		updateProfile,
		errors,
		username,
		setUsername,
		email,
		setEmail,
		twitter,
		setTwitter,
		timezone,
		setTimezone,
		availableFrom,
		setAvailableFrom,
		availableTo,
		setAvailableTo,
		weekendOffline,
		setWeekendOffline,
		updateUserProfile,
		fetchUserProfile,
		deleteTelegramInfo,
		telegramUserId,
		setTelegramUserId,
		telegramUsername,
		setTelegramUsername,
		telegramBotLink,
		whatsappCountryCode,
		setWhatsappCountryCode,
		whatsappNumber,
		setWhatsappNumber,
		refreshUserProfile: fetchUserProfile
	};
};

export default useUserProfile;
