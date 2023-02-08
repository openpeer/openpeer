import { Input, Loading } from 'components';
import { verifyMessage } from 'ethers/lib/utils.js';
import { User } from 'models/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import snakecaseKeys from 'snakecase-keys';
import { useAccount, useSignMessage } from 'wagmi';

import { ListStepProps } from './Listing.types';
import StepLayout from './StepLayout';

const Details = ({}: ListStepProps) => {
	const router = useRouter();
	const { address } = useAccount();

	const [user, setUser] = useState<User>();
	const [email, setEmail] = useState<string>('');
	const [loading, setLoading] = useState(false);

	const { signMessage } = useSignMessage({
		onSuccess: async (data, variables) => {
			const signingAddress = verifyMessage(variables.message, data);
			if (signingAddress === address && !!user && address === user.address) {
				const result = await fetch(`/api/users/${address}`, {
					method: 'PUT',
					body: JSON.stringify(
						snakecaseKeys({ user, data, address, message: variables.message }, { deep: true })
					)
				});
				const response = await result.json();
				if (response.id) {
					router.push('/');
				}
			}
		}
	});

	const onProceed = () => {
		if (!email || !user) return;
		const validEmail = /\S+@\S+\.\S+/.test(email);
		if (!validEmail) return;
		const userWithEmail: User = { ...user, ...{ email } };
		setUser(userWithEmail);
		const message = JSON.stringify(snakecaseKeys(userWithEmail, { deep: true }), undefined, 4);
		signMessage({ message: message });
	};

	useEffect(() => {
		setLoading(true);
		fetch(`/api/users/${address}`)
			.then((res) => res.json())
			.then((data) => {
				setLoading(false);
				setUser(data);
				setEmail(data.email || '');
			});
	}, [address]);

	if (loading) return <Loading />;

	return (
		<StepLayout onProceed={onProceed} buttonText="Update email">
			<div className="my-8">
				<Input
					id="email"
					type="email"
					label="Notification email address"
					value={email}
					placeholder="email@example.com"
					onChange={setEmail}
				/>
			</div>
		</StepLayout>
	);
};

export default Details;
