import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { S3 } from 'aws-sdk';
import { Errors } from 'models/errors';
import { User } from 'models/types';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface ErrorObject {
	[fieldName: string]: string[];
}

const useUserProfile = ({ onUpdateProfile }: { onUpdateProfile?: (user: User) => void }) => {
	const [user, setUser] = useState<User | null>();
	const [username, setUsername] = useState<string>();
	const [email, setEmail] = useState<string>();
	const [twitter, setTwitter] = useState<string>();
	const [errors, setErrors] = useState<Errors>({});

	const { address } = useAccount();

	useEffect(() => {
		if (!address) return;

		fetch(`/api/user_profiles/${address}`, {
			headers: {
				Authorization: `Bearer ${getAuthToken()}`
			}
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.errors) {
					setUser(null);
				} else {
					setUser(data);
				}
			});
	}, [address]);

	useEffect(() => {
		if (user) {
			setUsername(user.name || '');
			setEmail(user.email || '');
			setTwitter(user.twitter || '');
		}
	}, [user]);

	const updateUserProfile = async (profile: User, showNotification = true) => {
		const result = await fetch(`/api/user_profiles/${address}`, {
			method: 'PUT',
			body: JSON.stringify({ user_profile: profile }),
			headers: {
				Authorization: `Bearer ${getAuthToken()}`
			}
		});

		const newUser = await result.json();

		if (newUser.id) {
			setUser(newUser);
			if (!showNotification) return;
			onUpdateProfile?.(newUser);
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
	};

	const onUploadFinished = async ({ Key: image }: S3.ManagedUpload.SendData) => {
		updateUserProfile({ ...user, ...{ image } } as User, false);
	};

	const updateProfile = () => {
		setErrors({});
		const newUser = { ...user, ...{ name: username || null, email: email || null, twitter: twitter || null } };
		updateUserProfile(newUser as User);
	};

	return {
		user,
		onUploadFinished,
		updateProfile,
		errors,
		username,
		setUsername,
		email,
		setEmail,
		twitter,
		setTwitter
	};
};

export default useUserProfile;
