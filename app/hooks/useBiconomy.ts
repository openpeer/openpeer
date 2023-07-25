import { networkApiKeys } from 'models/networks';
import { useEffect, useState } from 'react';
import { useEthersSigner } from 'utils/ethers';
import { useAccount, useNetwork } from 'wagmi';

import { Biconomy } from '@biconomy/mexa';

interface UseBiconomyProps {
	contract: `0x${string}`;
}

const useBiconomy = ({ contract }: UseBiconomyProps) => {
	const [biconomy, setBiconomy] = useState<Biconomy | null>();
	const { address } = useAccount();
	const { chain, chains } = useNetwork();
	const chainId = (chain || chains[0]).id;
	const apiKey = networkApiKeys[chainId];
	const [gaslessEnabled, setGaslessEnabled] = useState<boolean>();
	const signer = useEthersSigner();

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
					contractAddresses: [contract]
				});
				await client.init();
				setBiconomy(client);
			}
		};
		initBiconomy();
	}, [address, chain, signer, contract, apiKey]);

	useEffect(() => {
		canSubmitGaslessTransaction();
	}, [address, apiKey]);

	return { biconomy, gaslessEnabled };
};
export default useBiconomy;
