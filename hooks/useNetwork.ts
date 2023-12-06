import { useNetwork as wagmiUseNetwork } from 'wagmi';
import { tron } from 'models/networks';
import useAccount from './useAccount';

const useNetwork = () => {
	const { chain } = wagmiUseNetwork();
	const { evm, isConnected } = useAccount();

	if (evm) {
		return { chain };
	}

	return { chain: isConnected ? tron : undefined };
};

export default useNetwork;
