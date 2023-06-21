import { Verification } from 'models/verification';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

import { QuadAttribute } from '@quadrata/client-react';

export interface AttributeOnboardStatusDto {
	data: {
		type: 'attributes';
		toClaim: QuadAttribute[];
	};
}

const useVerificationStatus = (address: `0x${string}` | undefined) => {
	const [verification, setVerification] = useState<Verification>();
	const { chain } = useNetwork();
	const requiredAttributes = [QuadAttribute.DID, QuadAttribute.AML];

	const apiAttributesOnboardStatus = async (accessToken: string) => {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_QUADRATA_API_URL}/attributes/onboard_status?wallet=${address}&chainId=${
				chain!.id
			}&attributes=${requiredAttributes.map((attr) => attr.toLowerCase()).join(',')}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`
				}
			}
		);
		if (!response.ok) {
			throw new Error('/attributes/onboard_status Failed');
		}
		return (await response.json()) as AttributeOnboardStatusDto;
	};

	const fetchVerificationStatus = async () => {
		const response = await fetch(`/api/verifications?alias=${address}`);
		const result = await response.json();
		setVerification(result);

		if (result.status !== 'VERIFIED') {
			// verify on quadrata
			const quadrataResponse = await fetch('/api/quadrata');
			const { accessToken } = await quadrataResponse.json();
			const { data } = await apiAttributesOnboardStatus(accessToken);
			setVerification({
				session_id: address as string,
				alias: address as string,
				status: data.toClaim.length === 0 ? 'VERIFIED' : 'PENDING'
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
