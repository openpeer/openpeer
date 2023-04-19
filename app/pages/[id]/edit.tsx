import { S3 } from 'aws-sdk';
import { Avatar, Button, HeaderH3, Input, Loading, WrongNetwork } from 'components';
import ImageUploader from 'components/ImageUploader';
import { useConnection } from 'hooks';
import { Errors } from 'models/errors';
import { User } from 'models/types';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import ErrorPage from 'next/error';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount } from 'wagmi';

interface ErrorObject {
	[fieldName: string]: string[];
}

const EditProfile = ({ id }: { id: `0x${string}` }) => {
	const [user, setUser] = useState<User | null>();
	const { address: connectedAddress } = useAccount();
	const { wrongNetwork } = useConnection();
	const { data: session } = useSession();

	const [username, setUsername] = useState<string>();
	const [email, setEmail] = useState<string>();
	const [twitter, setTwitter] = useState<string>();
	const [errors, setErrors] = useState<Errors>({});

	useEffect(() => {
		if (!session) return;

		fetch(`/api/user_profiles/${id}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.errors) {
					setUser(null);
				} else {
					setUser(data);
				}
			});
	}, [id, session]);

	useEffect(() => {
		if (user) {
			setUsername(user.name || '');
			setEmail(user.email || '');
			setTwitter(user.twitter || '');
		}
	}, [user]);

	const updateUserProfile = async (profile: User, showNotification = true) => {
		const result = await fetch(`/api/user_profiles/${connectedAddress}`, {
			method: 'PUT',
			body: JSON.stringify({ user_profile: profile })
		});

		const newUser = await result.json();
		if (newUser.id) {
			setUser(newUser);
			if (!showNotification) return;

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

	const onUpdateProfile = () => {
		setErrors({});
		const newUser = { ...user, ...{ name: username || null, email: email || null, twitter: twitter || null } };
		updateUserProfile(newUser as User);
	};

	if (user === undefined) {
		return <Loading />;
	}
	if (user === null) {
		return <ErrorPage statusCode={404} />;
	}
	if (wrongNetwork || id !== connectedAddress) return <WrongNetwork />;

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
						<ImageUploader address={connectedAddress} onUploadFinished={onUploadFinished} />
					</div>
				</div>
			</div>
			<div className="w-full md:w-80">
				<div className="mb-2">
					<HeaderH3 title="Account info" />
					<Input label="Username" id="username" value={username} onChange={setUsername} error={errors.name} />
					<Input label="Email Address" id="email" value={email} onChange={setEmail} type="email" />
				</div>
				<div className="mb-2">
					<HeaderH3 title="Social" />
					<Input label="Twitter" id="twitter" value={twitter} onChange={setTwitter} />
				</div>
				<div>
					<Button title="Update profile" onClick={onUpdateProfile} />
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => ({
	props: { title: 'Edit Profile', id: String(context.params?.id) } // will be passed to the page component as props
});

export default EditProfile;
