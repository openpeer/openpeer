import { Verification } from 'models/verification';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const useVerification = (address?: `0x${string}`) => {
	const [verification, setVerification] = useState<Verification>();
	const { address: connectedAddress } = useAccount();
	const userAddress = address || connectedAddress;

	const verifyStatus = async () => {
		if (userAddress) {
			const request = await fetch(`/api/verifications?alias=${userAddress}`);
			setVerification(await request.json());
		}
	};

	useEffect(() => {
		verifyStatus();
	}, [userAddress]);

	const verified = verification && verification.status === 'VERIFIED';

	return { verification, verified, verifyStatus };
};

export default useVerification;
