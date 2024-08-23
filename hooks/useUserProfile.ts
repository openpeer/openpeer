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
	const [user, setUser] = useState<User | null>(null);
	const [isUpdating, setIsUpdating] = useState(false);
	const [username, setUsername] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [twitter, setTwitter] = useState<string>('');
	const [timezone, setTimezone] = useState<string | undefined>();
	const [availableFrom, setAvailableFrom] = useState<number | undefined>();
	const [availableTo, setAvailableTo] = useState<number | undefined>();
	const [weekendOffline, setWeekendOffline] = useState<boolean | undefined>();

	const [telegramUserId, setTelegramUserId] = useState<string>('');
	const [telegramUsername, setTelegramUsername] = useState<string>('');
	const [telegramBotLink, setTelegramBotLink] = useState('');
	const [whatsappCountryCode, setWhatsappCountryCode] = useState<string>('');
	const [whatsappNumber, setWhatsappNumber] = useState<string>('');

	const [errors, setErrors] = useState<Errors>({});

	const { address } = useAccount();

	const updateUserState = useCallback(
		(data: User) => {
			const hasChanged = JSON.stringify(user) !== JSON.stringify(data);
			if (hasChanged) {
				setUser(data);
				setUsername(data.name || '');
				setEmail(data.email || '');
				setTwitter(data.twitter || '');
				setTimezone(data.timezone || undefined);
				setAvailableFrom(data.available_from || undefined);
				setAvailableTo(data.available_to || undefined);
				setWeekendOffline(data.weekend_offline);
				setTelegramUserId(data.telegram_user_id?.toString() || '');
				setTelegramUsername(data.telegram_username || '');
				setWhatsappCountryCode(data.whatsapp_country_code || '');
				setWhatsappNumber(data.whatsapp_number || '');

				const uniqueIdentifier = data.unique_identifier;
				const botLink = `https://telegram.me/openpeer_bot?start=${uniqueIdentifier}`;
				setTelegramBotLink(botLink);

				console.log('User updated:', data);
				console.log('Telegram info:', {
					telegramUserId: data.telegram_user_id,
					telegramUsername: data.telegram_username
				});
			}
		},
		[user]
	);

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
				updateUserState(data);
				console.log('User profile fetched:', data);
			}
		} catch (error) {
			console.error('Error fetching user profile:', error);
		}
	}, [address, updateUserState]);

	useEffect(() => {
		fetchUserProfile();
	}, [address, fetchUserProfile]);

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
				updateUserState(newUser);
				if (showNotification) {
					onUpdateProfile?.(newUser);
				}
				console.log('User profile updated:', newUser);
			} else {
				const foundErrors: ErrorObject = newUser.errors;
				Object.entries(foundErrors).forEach(([fieldName, messages]) => {
					const formattedMessages = messages.map(
						(message) => `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} ${message}`
					);
					setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: formattedMessages.join(', ') }));
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
		updateUserProfile({ ...user, image } as User, false);
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

	const refreshUserProfile = useCallback(async () => {
		if (!address) return { success: false, error: 'No address provided' };

		try {
			console.log('Fetching user profile...');
			const res = await fetch(`/api/user_profiles/${address}`, {
				headers: {
					Authorization: `Bearer ${getAuthToken()}`
				}
			});
			const data = await res.json();
			if (data.errors) {
				if (data.errors.telegram_user_id && data.errors.telegram_user_id.includes('has already been taken')) {
					return { success: false, error: 'This Telegram account is already associated with another user.' };
				}
				return { success: false, error: 'Failed to fetch user profile' };
			} else {
				updateUserState(data);
				console.log('User profile fetched:', data);
				return { success: true };
			}
		} catch (error) {
			console.error('Error fetching user profile:', error);
			return { success: false, error: 'An error occurred while fetching the user profile' };
		}
	}, [address, updateUserState]);

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
		refreshUserProfile
	};
};

export default useUserProfile;
