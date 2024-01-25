import Input from 'components/Input/Input';
import Label from 'components/Label/Label';
import Loading from 'components/Loading/Loading';
import { useUserProfile } from 'hooks';
import { User } from 'models/types';
import React from 'react';

import StepLayout from './StepLayout';

const AccountInfo = ({ setUser }: { setUser: (user: User) => void }) => {
	const { user, updateProfile, errors, username, setUsername, email, setEmail } = useUserProfile({
		onUpdateProfile: setUser
	});

	if (user === undefined) {
		return <Loading />;
	}

	return (
		<StepLayout onProceed={updateProfile}>
			<div className="my-8">
				<Label title="Set your account info to receive notifications" />
				<Input
					placeholder="@satoshi"
					label="Username"
					id="username"
					value={username}
					onChange={setUsername}
					error={errors.name}
				/>
				<Input
					placeholder="satoshi@bitcoin.org"
					label="Email Address"
					id="email"
					type="email"
					value={email}
					onChange={setEmail}
					error={errors.email}
				/>
			</div>
		</StepLayout>
	);
};

export default AccountInfo;
