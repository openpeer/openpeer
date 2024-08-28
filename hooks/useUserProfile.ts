import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { S3 } from 'aws-sdk';
import { Errors, ERROR_FIELDS, ErrorFields } from 'models/errors';
import { User } from 'models/types';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useAccount } from 'wagmi';
import { isEqual, debounce, DebouncedFunc } from 'lodash';

interface ErrorObject {
	[fieldName: string]: string[];
}

const useUserProfile = ({ onUpdateProfile }: { onUpdateProfile?: (user: User) => void }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdatingDebounced, setIsUpdatingDebounced] = useState(false);
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

	const validateProfile = (profile: Partial<User>): Errors => {
		const errors: Errors = {};

		const alphanumericUnderscoreRegex = /^[a-zA-Z0-9_]+$/;

		if (profile.name && !alphanumericUnderscoreRegex.test(profile.name)) {
			errors['name'] = 'Username must contain only alphanumeric characters and underscores';
		}

		if (profile.twitter) {
			if (profile.twitter.includes('@')) {
				errors.twitter = 'Twitter handle should not include the @ symbol';
			} else if (!alphanumericUnderscoreRegex.test(profile.twitter)) {
				errors.twitter = 'Twitter handle must contain only alphanumeric characters and underscores';
			}
		}

		if (profile.email && !/\S+@\S+\.\S+/.test(profile.email)) {
			errors.email = 'Invalid email format';
		}

		if (profile.whatsapp_country_code && !profile.whatsapp_number) {
			errors.whatsapp_number = 'WhatsApp number is required when country code is provided';
		}

		if (profile.whatsapp_number && !profile.whatsapp_country_code) {
			errors.whatsapp_country_code = 'WhatsApp country code is required when number is provided';
		}

		return errors;
	};

	const updateUserProfile = useCallback(
		async (profile: Partial<User>, showNotification = true) => {
			const validationErrors = validateProfile(profile);
			if (Object.keys(validationErrors).length > 0) {
				setErrors(validationErrors);
				return;
			}

			try {
				setIsUpdating(true);
				let userProfileData = { ...profile };

				// Only include WhatsApp data if both country code and number are present
				if (profile.whatsapp_country_code || profile.whatsapp_number) {
					if (!profile.whatsapp_country_code || !profile.whatsapp_number) {
						throw new Error('Both WhatsApp country code and number must be provided.');
					}
				}

				// Ensure we're not sending empty objects for nested properties
				Object.keys(userProfileData).forEach((key) => {
					const k = key as keyof Partial<User>;
					if (
						typeof userProfileData[k] === 'object' &&
						userProfileData[k] !== null &&
						Object.keys(userProfileData[k] as object).length === 0
					) {
						delete userProfileData[k];
					}
				});

				console.log('Sending user profile data to API:', userProfileData);

				const result = await fetch(`/api/user_profiles/${address}`, {
					method: 'PUT',
					body: JSON.stringify({ user_profile: userProfileData }),
					headers: {
						Authorization: `Bearer ${getAuthToken()}`,
						'Content-Type': 'application/json'
					}
				});

				if (!result.ok) {
					const errorData = await result.json();
					throw new Error(errorData.message || 'Failed to update user profile');
				}

				const newUser = await result.json();
				console.log('API Response:', newUser);

				if (newUser.id) {
					updateUserState(newUser);
					if (showNotification) {
						onUpdateProfile?.(newUser);
					}
					console.log('User profile updated:', newUser);
				} else {
					throw new Error('Invalid response from server');
				}
			} catch (error) {
				console.error('Error updating profile:', error);
				setErrors((prevErrors) => ({
					...prevErrors,
					general: error instanceof Error ? error.message : 'An unknown error occurred'
				}));
				throw error;
			} finally {
				setIsUpdating(false);
			}
		},
		[address, onUpdateProfile, updateUserState, validateProfile]
	);

	const debouncedUpdateUserProfile = useMemo(
		() =>
			debounce((profile: Partial<User>, showNotification = false) => {
				setIsUpdatingDebounced(true);
				return updateUserProfile(profile, showNotification).finally(() => {
					setIsUpdatingDebounced(false);
				});
			}, 2000),
		[updateUserProfile]
	);

	const safeUpdateProfile = useCallback(
		(profile: Partial<User>, showNotification = false) => {
			const result = debouncedUpdateUserProfile(profile, showNotification);
			return result || Promise.resolve();
		},
		[debouncedUpdateUserProfile]
	) as unknown as DebouncedFunc<typeof updateUserProfile>;

	safeUpdateProfile.cancel = debouncedUpdateUserProfile.cancel;
	safeUpdateProfile.flush = debouncedUpdateUserProfile.flush;

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
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || 'Failed to fetch user profile');
			}
			const data = await res.json();
			updateUserState(data);
			console.log('User profile refreshed:', data);
			return { success: true, user: data };
		} catch (error) {
			console.error('Error refreshing user profile:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'An error occurred while fetching the user profile'
			};
		}
	}, [address, updateUserState]);

	return useMemo(
		() => ({
			user,
			isUpdating,
			isUpdatingDebounced,
			onUploadFinished,
			updateProfile: safeUpdateProfile,
			updateUserProfile,
			errors,
			fetchUserProfile,
			deleteTelegramInfo,
			refreshUserProfile,
			telegramBotLink: telegramBotLinkRef.current,
			validateProfile
		}),
		[
			user,
			isUpdating,
			isUpdatingDebounced,
			onUploadFinished,
			debouncedUpdateUserProfile,
			updateUserProfile,
			errors,
			fetchUserProfile,
			deleteTelegramInfo,
			refreshUserProfile,
			validateProfile
		]
	);
};

export default useUserProfile;
