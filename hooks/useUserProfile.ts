// hooks/useUserProfile.ts
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { S3 } from 'aws-sdk';
import { Errors } from 'models/errors';
import { User } from 'models/types';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useAccount } from 'wagmi';
import { isEqual, debounce } from 'lodash';

interface ErrorObject {
	[fieldName: string]: string[];
}

const useUserProfile = ({ onUpdateProfile }: { onUpdateProfile?: (user: User) => void }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isUpdating, setIsUpdating] = useState(false);
	const [errors, setErrors] = useState<Errors>({});
	const { address } = useAccount();

	const telegramBotLinkRef = useRef<string>('');

	const updateUserState = useCallback((data: User) => {
		setUser((prevUser) => {
			if (!isEqual(prevUser, data)) {
				const uniqueIdentifier = data.unique_identifier;
				telegramBotLinkRef.current = `https://telegram.me/openpeer_bot?start=${uniqueIdentifier}`;
				console.log('User updated:', data);
				return data;
			}
			return prevUser;
		});
	}, []);

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
	}, [fetchUserProfile]);

	const updateUserProfile = useCallback(
		async (profile: Partial<User>, showNotification = true) => {
			try {
				setIsUpdating(true);
				let userProfileData = { ...profile };

				// Only include WhatsApp data if both country code and number are present
				if (profile.whatsapp_country_code || profile.whatsapp_number) {
					if (!profile.whatsapp_country_code || !profile.whatsapp_number) {
						throw new Error('Both WhatsApp country code and number must be provided.');
					}
				}

				// Don't overwrite Telegram data with null values
				if (userProfileData.telegram_user_id === null) delete userProfileData.telegram_user_id;
				if (userProfileData.telegram_username === null) delete userProfileData.telegram_username;

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
					setErrors((prevErrors) => {
						const newErrors: Errors = {};
						Object.entries(foundErrors).forEach(([fieldName, messages]) => {
							newErrors[fieldName] = messages.join(', ');
						});
						return { ...prevErrors, ...newErrors };
					});
				}
			} catch (error) {
				console.error('Error updating profile:', error);
				setErrors((prevErrors) => ({
					...prevErrors,
					general: error instanceof Error ? error.message : 'An unknown error occurred'
				}));
			} finally {
				setIsUpdating(false);
			}
		},
		[address, onUpdateProfile, updateUserState]
	);

	const debouncedUpdateUserProfile = useMemo(() => debounce(updateUserProfile, 500), [updateUserProfile]);

	const deleteTelegramInfo = useCallback(async () => {
		await updateUserProfile({
			telegram_user_id: null,
			telegram_username: null
		});
		await fetchUserProfile();
	}, [updateUserProfile, fetchUserProfile]);

	const onUploadFinished = useCallback(
		async ({ Key: image }: S3.ManagedUpload.SendData) => {
			updateUserProfile({ ...user, image } as User, false);
		},
		[user, updateUserProfile]
	);

	const refreshUserProfile = useCallback(async () => {
		if (!address) return { success: false, error: 'No address provided' };

		try {
			console.log('Refreshing user profile...');
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
				console.log('User profile refreshed:', data);
				return { success: true };
			}
		} catch (error) {
			console.error('Error refreshing user profile:', error);
			return { success: false, error: 'An error occurred while fetching the user profile' };
		}
	}, [address, updateUserState]);

	return useMemo(
		() => ({
			user,
			isUpdating,
			onUploadFinished,
			updateProfile: debouncedUpdateUserProfile,
			updateUserProfile,
			errors,
			fetchUserProfile,
			deleteTelegramInfo,
			refreshUserProfile,
			telegramBotLink: telegramBotLinkRef.current
		}),
		[
			user,
			isUpdating,
			onUploadFinished,
			debouncedUpdateUserProfile,
			updateUserProfile,
			errors,
			fetchUserProfile,
			deleteTelegramInfo,
			refreshUserProfile
		]
	);
};

export default useUserProfile;
