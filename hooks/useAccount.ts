import { useDynamicContext } from '@dynamic-labs/sdk-react';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useAccount as useWagmiAccount } from 'wagmi';

const useAccount = () => {
	const { address, isConnected, isConnecting, connector } = useWagmiAccount();
	const tronAccount = useWallet();
	const { primaryWallet } = useDynamicContext();

	if (address || primaryWallet?.address) {
		return {
			address: address || (primaryWallet?.address as `0x${string}` | undefined),
			isConnected,
			isConnecting,
			walletName: connector?.name || '',
			evm: true
		};
	}
	return {
		address: tronAccount.address as `0x${string}` | undefined,
		isConnected: tronAccount.connected,
		isConnecting: tronAccount.connecting,
		walletName: tronAccount.wallet?.adapter.name || '',
		evm: false
	};
};

export default useAccount;
