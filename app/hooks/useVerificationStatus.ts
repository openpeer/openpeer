import { Verification } from 'models/verification';
import { useEffect, useState } from 'react';

const useVerificationStatus = (address: `0x${string}` | undefined) => {
	const [verification, setVerification] = useState<Verification>();

	const fetchVerificationStatus = async () => {
		const request = await fetch(`/api/verifications?alias=${address}`);
		setVerification(await request.json());
	};

	useEffect(() => {
		if (address) {
			fetchVerificationStatus();
		}
	}, [address]);

	const verified = verification && verification.status === 'VERIFIED';

	return { verification, verified: !!verified, fetchVerificationStatus };
};

export default useVerificationStatus;
