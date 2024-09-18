import { Avatar, HeaderH3, Input, Loading } from 'components';
import Select from 'components/Select/Select';
import ImageUploader from 'components/ImageUploader';
import { useUserProfile, useAccount } from 'hooks';
import { GetServerSideProps } from 'next';
import ErrorPage from 'next/error';
import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import countryCodes from 'utils/countryCodes';
import TelegramSection from '../../components/TelegramSection';
import { isEqual } from 'lodash';
import { User } from 'models/types';
import { Errors } from 'models/errors';
import TrustedUsers from 'components/TrustedUsers';

const EditProfile = ({ id }: { id: `0x${string}` }) => {
	const { address } = useAccount();
	const onUpdateProfile = useCallback(() => {
		toast.success('Profile updated', {
			theme: 'dark',
			position: 'top-right',
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: false,
			progress: undefined
		});
	}, []);

	const {
		user,
		onUploadFinished,
		updateProfile,
		errors,
		deleteTelegramInfo,
		refreshUserProfile,
		telegramBotLink,
		validateProfile,
		isUpdatingDebounced
	} = useUserProfile({ onUpdateProfile });

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [twitter, setTwitter] = useState('');
	const [whatsappCountryCode, setWhatsappCountryCode] = useState('');
	const [whatsappNumber, setWhatsappNumber] = useState('');
	const [telegramUserId, setTelegramUserId] = useState('');
	const [telegramUsername, setTelegramUsername] = useState('');
	const [updatingFields, setUpdatingFields] = useState<Set<string>>(new Set());

	const [acceptOnlyTrusted, setAcceptOnlyTrusted] = useState(false);
	const [selectedTrustedUsers, setSelectedTrustedUsers] = useState<User[]>([]);

	const [localErrors, setLocalErrors] = useState<Errors>({});

	useEffect(() => {
		if (user) {
			const newState = {
				username: user.name || '',
				email: user.email || '',
				twitter: user.twitter || '',
				whatsappCountryCode: user.whatsapp_country_code || '',
				whatsappNumber: user.whatsapp_number || '',
				telegramUserId: user.telegram_user_id || '',
				telegramUsername: user.telegram_username || ''
			};

			if (
				!isEqual(newState, {
					username,
					email,
					twitter,
					whatsappCountryCode,
					whatsappNumber,
					telegramUserId,
					telegramUsername
				})
			) {
				setUsername(newState.username);
				setEmail(newState.email);
				setTwitter(newState.twitter);
				setWhatsappCountryCode(newState.whatsappCountryCode);
				setWhatsappNumber(newState.whatsappNumber);
				setTelegramUserId(newState.telegramUserId);
				setTelegramUsername(newState.telegramUsername);
			}
		}
	}, [user]);

	useEffect(() => {
		// Update localErrors when errors from useUserProfile change
		setLocalErrors(errors);
	}, [errors]);

	const handleFieldChange = useCallback(
		(field: string, value: string) => {
			if (user && user[field as keyof User] === value) {
				return;
			}

			let updatedProfile: Partial<User> = { [field]: value };

			if (field === 'whatsapp_country_code') {
				updatedProfile.whatsapp_number = whatsappNumber;
			} else if (field === 'whatsapp_number') {
				updatedProfile.whatsapp_country_code = whatsappCountryCode;
			}

			const validationErrors = validateProfile(updatedProfile);
			setLocalErrors(validationErrors);

			if (Object.keys(validationErrors).length === 0 && updateProfile) {
				setUpdatingFields((prev) => new Set(prev).add(field));

				(updateProfile?.(updatedProfile, false) ?? Promise.resolve())
					.then(() => {
						console.log(`Field ${field} updated successfully`);
						setLocalErrors((prev) => {
							const newErrors = { ...prev };
							delete newErrors[field as keyof Errors];
							return newErrors;
						});
					})
					.catch((error) => {
						console.error(`Error updating field ${field}:`, error);
						setLocalErrors((prev) => ({
							...prev,
							[field]: error.message || 'An error occurred while updating'
						}));
					})
					.finally(() => {
						setTimeout(() => {
							setUpdatingFields((prev) => {
								const newSet = new Set(prev);
								newSet.delete(field);
								return newSet;
							});
						}, 2000);
					});
			}
		},
		[updateProfile, validateProfile, whatsappCountryCode, whatsappNumber, user]
	);

	const clearFieldError = useCallback((field: string) => {
		setLocalErrors((prev) => {
			const newErrors = { ...prev };
			delete newErrors[field as keyof Errors];
			return newErrors;
		});
	}, []);

	if (user === undefined) {
		return <Loading />;
	}
	if (user === null || id !== address) {
		return <ErrorPage statusCode={404} />;
	}

	return (
		<div className="w-full m-auto flex flex-col sm:flex-row px-8 py-4 gap-x-16 justify-center mt-8">
			{/* Avatar section */}
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

			{/* Profile info section */}
			<div className="w-full md:w-80">
				<div className="mb-2">
					<HeaderH3 title="Account info" />
					<Input
						label="Username"
						id="username"
						value={username}
						onChange={(value) => {
							setUsername(value);
							clearFieldError('name');
						}}
						onBlur={() => handleFieldChange('name', username)}
						error={localErrors.name}
						helperText="Use only alphanumeric characters and underscores (3-15 characters)"
						isUpdating={updatingFields.has('name')}
						maxLength={15}
					/>
					<Input
						label="Email Address"
						id="email"
						value={email}
						onChange={(value) => {
							setEmail(value);
							clearFieldError('email');
						}}
						onBlur={() => handleFieldChange('email', email)}
						type="email"
						error={localErrors.email}
						isUpdating={updatingFields.has('email')}
					/>
				</div>
				<div className="mb-2">
					<HeaderH3 title="Social" />
					<Input
						label="X (Twitter)"
						id="twitter"
						value={twitter}
						onChange={(value) => {
							setTwitter(value);
							clearFieldError('twitter');
						}}
						onBlur={() => handleFieldChange('twitter', twitter)}
						error={localErrors.twitter}
						helperText="Use only alphanumeric characters and underscores, without @ (3-15 characters)"
						isUpdating={updatingFields.has('twitter')}
						maxLength={15}
					/>
				</div>
				<div className="mb-2">
					<HeaderH3 title="Messaging" />

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
								handleFieldChange('whatsapp_country_code', selectedCountry.code);
							} else {
								setWhatsappCountryCode('');
							}
						}}
					/>
					<Input
						label="WhatsApp Number"
						id="whatsappNumber"
						value={whatsappNumber}
						onChange={(value) => {
							setWhatsappNumber(value);
							clearFieldError('whatsapp_number');
						}}
						onBlur={() => handleFieldChange('whatsapp_number', whatsappNumber)}
						helperText="Enter only digits, without spaces or dashes. Do not include the country code with the number. (max 17 digits)"
						isUpdating={updatingFields.has('whatsapp_number')}
						maxLength={17}
					/>
					{isUpdatingDebounced && <p className="text-sm text-blue-500 mt-4">Saving changes...</p>}
				</div>
				<div className="w-full md:w-80">
					<HeaderH3 title="Relationships" />
					<TrustedUsers
						acceptOnlyTrusted={acceptOnlyTrusted}
						setAcceptOnlyTrusted={setAcceptOnlyTrusted}
						selectedTrustedUsers={selectedTrustedUsers}
						setSelectedTrustedUsers={setSelectedTrustedUsers}
						context="profile"
					/>
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => ({
	props: { title: 'Edit Profile', id: String(context.params?.id) }
});

export default EditProfile;
