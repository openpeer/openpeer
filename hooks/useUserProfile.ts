// hooks/useUserProfile.ts
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { S3 } from 'aws-sdk';
import { Errors } from 'models/errors';
import { User } from 'models/types';
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useAccount } from 'wagmi';
import { isEqual, debounce, DebouncedFunc } from 'lodash';

const useUserProfile = ({ onUpdateProfile }: { onUpdateProfile?: (user: User) => void }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isUpdatingDebounced, setIsUpdatingDebounced] = useState(false);
	const [errors, setErrors] = useState<Errors>({});
	const [previousProfile, setPreviousProfile] = useState<Partial<User> | null>(null);
	const { address } = useAccount();
	const { authToken } = useDynamicContext(); // Get authToken from useDynamicContext
	const [talkInitialized, setTalkInitialized] = useState(false);

	const telegramBotLinkRef = useRef<string>('');

	const updateUserState = useCallback((data: User) => {
		setUser((prevUser) => {
			if (!isEqual(prevUser, data)) {
				const uniqueIdentifier = data.unique_identifier;
				telegramBotLinkRef.current = `https://telegram.me/openpeer_bot?start=${uniqueIdentifier}`;
				// console.log('User updated:', data);
				return data;
			}
			return prevUser;
		});
	}, []);

	const fetchUserProfile = useCallback(async () => {
		if (!address || !authToken) return;

		try {
			// console.log('Fetching user profile...');
			const res = await fetch(`/api/user_profiles/${address}`, {
				headers: {
					Authorization: `Bearer ${authToken}`
				}
			});
			if (res.status === 401) {
				console.error('Unauthorized: Invalid or missing auth token');
				setUser(null);
				return;
			}
			const data = await res.json();
			if (data.errors) {
				setUser(null);
			} else {
				updateUserState(data);
				setPreviousProfile(data);
				// console.log('User profile fetched:', data);
			}
		} catch (error) {
			console.error('Error fetching user profile:', error);
		}
	}, [address, authToken, updateUserState]);

	useEffect(() => {
		fetchUserProfile();
	}, [fetchUserProfile]);

	const validateProfile = (profile: Partial<User>): Errors => {
		const errors: Errors = {};

		const alphanumericUnderscoreRegex = /^[a-zA-Z0-9_]+$/;

		if (profile.name) {
			if (profile.name.length < 3) {
				errors['name'] = 'Username must be at least 3 characters';
			} else if (profile.name.length > 15) {
				errors['name'] = 'Username must be 15 characters or less';
			} else if (!alphanumericUnderscoreRegex.test(profile.name)) {
				errors['name'] = 'Username must contain only alphanumeric characters and underscores';
			}
		}

		if (profile.twitter) {
			if (profile.twitter.length < 3) {
				errors.twitter = 'Twitter handle must be at least 3 characters';
			} else if (profile.twitter.length > 15) {
				errors.twitter = 'Twitter handle must be 15 characters or less';
			} else if (profile.twitter.includes('@')) {
				errors.twitter = 'Twitter handle should not include the @ symbol';
			} else if (!alphanumericUnderscoreRegex.test(profile.twitter)) {
				errors.twitter = 'Twitter handle must contain only alphanumeric characters and underscores';
			}
		}

		if (profile.email && !/\S+@\S+\.\S+/.test(profile.email)) {
			errors.email = 'Invalid email format';
		}

		if (profile.whatsapp_number && profile.whatsapp_number.length > 17) {
			errors.whatsapp_number = 'WhatsApp number must be 17 digits or less';
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
			if (!authToken) return; // Ensure authToken is available
			// console.log('Profile data before validation:', profile);
			const validationErrors = validateProfile(profile);
			if (Object.keys(validationErrors).length > 0) {
				setErrors(validationErrors);
				return;
			}

			// console.log('Profile data after validation:', profile);

			if (previousProfile && isEqual(previousProfile, profile)) {
				// console.log('Profile has not changed, skipping update.');
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

				// console.log('Sending user profile data to API:', userProfileData);

				const result = await fetch(`/api/user_profiles/${address}`, {
					method: 'PATCH',
					body: JSON.stringify({ user_profile: userProfileData }),
					headers: {
						Authorization: `Bearer ${authToken}`,
						'Content-Type': 'application/json'
					}
				});

				const responseData = await result.json();

				if (!result.ok) {
					if (result.status === 422) {
						// This is a validation error (e.g., username already taken)
						const errorMessage = responseData.data?.message || 'Validation error occurred';
						setErrors((prevErrors) => ({
							...prevErrors,
							name: errorMessage
						}));
						// Throw an error so that the calling function can catch it
						throw new Error(errorMessage);
					} else {
						// For other types of errors, throw an error to be caught below
						throw new Error(responseData.data?.message || 'An error occurred while updating the profile');
					}
				}

				// Check if responseData contains the updated user data
				if (responseData.data) {
					updateUserState(responseData.data);
					setPreviousProfile(responseData.data);
					if (showNotification) {
						onUpdateProfile?.(responseData.data);
					}
					// console.log('User profile updated:', responseData.data);
				} else {
					// console.log('Profile updated successfully, but no data returned. Fetching latest profile.');
					await fetchUserProfile();
				}
			} catch (error) {
				console.error('Error updating profile:', error);
				setErrors((prevErrors) => ({
					...prevErrors,
					general: error instanceof Error ? error.message : 'An unknown error occurred'
				}));
				// throw error;
			} finally {
				setIsUpdating(false);
			}
		},
		[address, authToken, onUpdateProfile, updateUserState, validateProfile, previousProfile, user, fetchUserProfile]
	);

	const debouncedUpdateUserProfile = useCallback(
		debounce((profile: Partial<User>, showNotification = false) => {
			// console.log('debouncedUpdateUserProfile called');
			setIsUpdatingDebounced(true);
			return updateUserProfile(profile, showNotification)
				.then((result) => {
					setIsUpdatingDebounced(false);
					return result;
				})
				.catch((error) => {
					setIsUpdatingDebounced(false);
					throw error;
				});
		}, 2000),
		[updateUserProfile]
	);

	const safeUpdateProfile = useCallback(
		(profile: Partial<User>, showNotification = false) => {
			const validationErrors = validateProfile(profile);
			if (Object.keys(validationErrors).length > 0) {
				setErrors(validationErrors);
				return Promise.resolve();
			}

			return debouncedUpdateUserProfile(profile, showNotification);
		},
		[debouncedUpdateUserProfile, validateProfile]
	) as unknown as DebouncedFunc<typeof updateUserProfile>;

	safeUpdateProfile.cancel = debouncedUpdateUserProfile.cancel;
	safeUpdateProfile.flush = debouncedUpdateUserProfile.flush;

	const deleteTelegramInfo = useCallback(async () => {
		if (!authToken) return;
		await updateUserProfile(
			{
				telegram_user_id: null,
				telegram_username: null
			},
			false
		);
		await fetchUserProfile();
	}, [updateUserProfile, fetchUserProfile, authToken]);

	const onUploadFinished = useCallback(
		async ({ Key: image }: S3.ManagedUpload.SendData) => {
			if (!authToken) return;
			updateUserProfile({ ...user, image } as User, false);
		},
		[user, updateUserProfile, authToken]
	);

	const refreshUserProfile = useCallback(async () => {
		if (!address || !authToken) return { success: false, error: 'No address or auth token provided' };

		try {
			// console.log('Refreshing user profile...');
			const res = await fetch(`/api/user_profiles/${address}`, {
				headers: {
					Authorization: `Bearer ${authToken}`
				}
			});
			if (!res.ok) {
				const errorData = await res.json();
				throw new Error(errorData.message || 'Failed to fetch user profile');
			}
			const data = await res.json();
			updateUserState(data);
			setPreviousProfile(data);
			// console.log('User profile refreshed:', data);
			return { success: true, user: data };
		} catch (error) {
			console.error('Error refreshing user profile:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'An error occurred while fetching the user profile'
			};
		}
	}, [address, authToken, updateUserState]);

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
			safeUpdateProfile,
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
