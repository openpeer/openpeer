// providers/CivicPassProvider.tsx

'use client';

import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { GatewayProvider } from '@civic/ethereum-gateway-react';
import { providers, Wallet } from 'ethers';
import { JsonRpcSigner as JsonRpcSignerV6, JsonRpcProvider as JsonRpcProviderV6 } from 'ethersv6';

interface CivicPassProviderProps extends PropsWithChildren {
	signerV5: providers.JsonRpcSigner | undefined;
}

const networkKey: string = (() => {
	const value = process.env.NEXT_PUBLIC_CIVIC_NETWORK_ID;
	if (!value) {
		console.error('NEXT_PUBLIC_CIVIC_NETWORK_ID is not defined in environment');
		throw new Error('NEXT_PUBLIC_CIVIC_NETWORK_ID is required');
	}
	return value;
})();

const v5ToV6Signer = async (signerV5: providers.JsonRpcSigner): Promise<JsonRpcSignerV6> => {
	const address = await signerV5.getAddress();
	const provider = signerV5.provider;

	const providerV6 = new JsonRpcProviderV6(provider.connection.url);
	return providerV6.getSigner(address);
};

export const CivicPassProvider: FC<CivicPassProviderProps> = ({ children, signerV5 }) => {
	const [wallet, setWallet] = useState<{
		signer: JsonRpcSignerV6;
		address: string;
	}>();

	useEffect(() => {
		if (signerV5) {
			v5ToV6Signer(signerV5)
				.then(async (v6Signer) => {
					const address = await v6Signer.getAddress();
					setWallet({
						signer: v6Signer,
						address
					});
				})
				.catch((error) => {
					console.error('Error converting signer:', error);
				});
		}
	}, [signerV5]);

	return (
		<GatewayProvider wallet={wallet as unknown as Wallet} gatekeeperNetwork={networkKey}>
			{children}
		</GatewayProvider>
	);
};
