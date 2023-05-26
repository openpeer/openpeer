import { networkApiKeys } from 'models/networks';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork, useSigner } from 'wagmi';

import { Biconomy } from '@biconomy/mexa';

interface UseBiconomyProps {
	contract: `0x${string}`;
}

const useBiconomy = ({ contract }: UseBiconomyProps) => {
	const [biconomy, setBiconomy] = useState<Biconomy | null>();
	const { address } = useAccount();
	const { chain, chains } = useNetwork();
	const { data: signer } = useSigner();
	const apiKey = networkApiKeys[(chain || chains[0]).id];
	const [gaslessEnabled, setGaslessEnabled] = useState(true);

	const canSubmitGaslessTransaction = async () => {
		if (apiKey && address) {
			try {
				const { allowed } = await (
					await fetch(`https://api.biconomy.io/api/v1/dapp/checkLimits?userAddress=${address}`, {
						headers: {
							'Content-Type': 'application/json',
							'x-api-key': apiKey
						}
					})
				).json();
				return setGaslessEnabled(!!allowed);
			} catch {
				return setGaslessEnabled(false);
			}
		}
		return setGaslessEnabled(false);
	};

	useEffect(() => {
		const initBiconomy = async () => {
			if (address && chain && signer?.provider && contract) {
				if (!apiKey) {
					setBiconomy(null);
					return;
				}

				const client = new Biconomy((signer.provider as any).provider, {
					apiKey,
					debug: true,
					contractAddresses: []
				});
				await client.init();
				setBiconomy(client);
			}
		};
		initBiconomy();
	}, [address, chain, signer, contract, apiKey]);

	useEffect(() => {
		canSubmitGaslessTransaction();
	}, [address]);

	return { biconomy, gaslessEnabled };
};
export default useBiconomy;
