import { networkApiKeys } from 'models/networks';
import { useEffect, useState } from 'react';
import { Biconomy } from '@biconomy/mexa';
import { getAuthToken, useDynamicContext } from '@dynamic-labs/sdk-react';
import useNetwork from './useNetwork';
import useAccount from './useAccount';

interface UseBiconomyProps {
	contract: `0x${string}`;
}

const useBiconomy = ({ contract }: UseBiconomyProps) => {
	const [biconomy, setBiconomy] = useState<Biconomy | null>();
	const { address, evm } = useAccount();
	const { chain } = useNetwork();
	const chainId = chain?.id || 0;
	const apiKey = networkApiKeys[chainId || 0];
	const [gaslessEnabled, setGaslessEnabled] = useState<boolean>();
	const { primaryWallet } = useDynamicContext();

	const canSubmitGaslessTransaction = async () => {
		if (apiKey && address && evm) {
			try {
				const { allowed } = await (
					await fetch(`https://api.biconomy.io/api/v1/dapp/checkLimits?userAddress=${address}`, {
						headers: {
							'Content-Type': 'application/json',
							'x-api-key': apiKey
						}
					})
				).json();

				let settingIsEnabled = true;
				try {
					const response = await fetch('/api/settings', {
						headers: {
							Authorization: `Bearer ${getAuthToken()}`
						}
					});

					const settings: { [key: string]: string } = await response.json();
					if (settings[`gasless_enabled_${chainId}`] === 'false' || settings.gasless_enabled === 'false') {
						settingIsEnabled = false;
					}
				} catch (_) {
					settingIsEnabled = false;
				}

				return setGaslessEnabled(!!allowed && settingIsEnabled);
			} catch {
				return setGaslessEnabled(false);
			}
		}
		return setGaslessEnabled(false);
	};

	useEffect(() => {
		const initBiconomy = async () => {
			if (address && chain && evm && primaryWallet && contract && apiKey) {
				const provider = await primaryWallet.connector.getWalletClient();
				if (!provider) return;

				const client = new Biconomy(provider, {
					apiKey,
					debug: true,
					contractAddresses: [contract]
				});
				await client.init();
				setBiconomy(client);
			} else {
				setBiconomy(null);
			}
		};
		initBiconomy();
	}, [address, chain, contract, apiKey, primaryWallet, evm]);

	useEffect(() => {
		canSubmitGaslessTransaction();
	}, [address, apiKey]);

	return { biconomy, gaslessEnabled };
};
export default useBiconomy;
