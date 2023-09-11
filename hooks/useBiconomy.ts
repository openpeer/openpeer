import { networkApiKeys } from 'models/networks';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { Biconomy } from '@biconomy/mexa';
import { useDynamicContext } from '@dynamic-labs/sdk-react';

interface UseBiconomyProps {
	contract: `0x${string}`;
}

const useBiconomy = ({ contract }: UseBiconomyProps) => {
	const [biconomy, setBiconomy] = useState<Biconomy | null>();
	const { address } = useAccount();
	const { chain, chains } = useNetwork();
	const chainId = (chain || chains[0])?.id;
	const apiKey = networkApiKeys[chainId || 0];
	const [gaslessEnabled, setGaslessEnabled] = useState<boolean>();
	const { primaryWallet } = useDynamicContext();

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
			if (address && chain && primaryWallet && contract) {
				const provider = await primaryWallet.connector.getWeb3Provider();
				if (!provider) return;

				if (!apiKey) {
					setBiconomy(null);
					return;
				}
				const client = new Biconomy(provider, {
					apiKey,
					debug: true,
					contractAddresses: [contract]
				});
				await client.init();
				setBiconomy(client);
			}
		};
		initBiconomy();
	}, [address, chain, contract, apiKey, primaryWallet]);

	useEffect(() => {
		canSubmitGaslessTransaction();
	}, [address, apiKey]);

	return { biconomy, gaslessEnabled };
};
export default useBiconomy;
