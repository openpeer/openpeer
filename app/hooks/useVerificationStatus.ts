import { getAuthToken } from '@dynamic-labs/sdk-react';
import { Verification } from 'models/verification';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

const useVerificationStatus = (address: `0x${string}` | undefined) => {
	const [verification, setVerification] = useState<Verification>();
	const { chain } = useNetwork();

	const fetchVerificationStatus = async () => {
		const response = await fetch(`/api/verifications?alias=${address}`);
		const result = await response.json();
		setVerification(result);

		if (result.status !== 'VERIFIED') {
			const userRequest = await fetch(`/api/users/${address}`, {
				headers: {
					Authorization: `Bearer ${getAuthToken()}`
				}
			});
			const { verified } = await userRequest.json();
			setVerification({
				session_id: address as string,
				alias: address as string,
				status: verified ? 'VERIFIED' : 'PENDING'
			});
		}
	};

	useEffect(() => {
		if (address && chain) {
			fetchVerificationStatus();
		}
	}, [address, chain]);

	const verified = verification && verification.status === 'VERIFIED';

	return { verification, verified: !!verified, fetchVerificationStatus };
};

export default useVerificationStatus;
