import { Chain, useNetwork as wagmiUseNetwork } from 'wagmi';
import { allChains } from 'models/networks';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useEffect, useState } from 'react';
import useAccount from './useAccount';

const useNetwork = () => {
	const { chain } = wagmiUseNetwork();
	const { wallet } = useWallet();
	const { evm, isConnected } = useAccount();

	const [tronChain, setTronChain] = useState<Chain>();
	const adapter = wallet?.adapter;

	const getChain = async () => {
		if (!evm && wallet) {
			// @ts-expect-error
			const { chainId } = await wallet.adapter.network();
			// @ts-expect-error
			setTronChain(allChains.find((c) => c.chainId === chainId));
		} else {
			setTronChain(undefined);
		}
	};

	useEffect(() => {
		getChain();
	}, [evm, isConnected]);

	useEffect(() => {
		if (adapter) {
			adapter.on('chainChanged', getChain);
		}

		return () => {
			if (adapter) {
				adapter.off('chainChanged', getChain);
			}
		};
	}, [adapter]);

	if (evm) {
		return { chain };
	}

	return { chain: isConnected ? tronChain : undefined };
};

export default useNetwork;
