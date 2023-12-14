import { networkApiKeys } from 'models/networks';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { Biconomy } from '@biconomy/mexa';
import { getAuthToken, useDynamicContext } from '@dynamic-labs/sdk-react-core';

interface UseBiconomyProps {
	contract: `0x${string}`;
}

const useBiconomy = ({ contract }: UseBiconomyProps) => {
	const [biconomy, setBiconomy] = useState<Biconomy | null>();
	const account = useAccount();
	const { chain, chains } = useNetwork();
	const chainId = (chain || chains[0])?.id;
	const apiKey = networkApiKeys[chainId || 0];
	const [gaslessEnabled, setGaslessEnabled] = useState<boolean>();
	const { primaryWallet } = useDynamicContext();
	const address = account.address || (primaryWallet?.address as `0x${string}`);

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
			if (address && chain && primaryWallet && contract) {
				const provider = await primaryWallet.connector.getWalletClient();
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
