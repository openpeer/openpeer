import { DEPLOYER_CONTRACTS, FULL_GASLESS_CHAINS } from 'models/networks';
import { useNetwork } from 'wagmi';

import useDeployWithGas from './useDeployWithGas';
import useGaslessDeploy from './useGaslessDeploy';

const useDeploy = () => {
	const { chain } = useNetwork();
	const contract = DEPLOYER_CONTRACTS[chain?.id!];

	const withGasCall = useDeployWithGas({
		contract
	});

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, deploy } = useGaslessDeploy({
		contract
	});

	if (isFetching || !chain) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (gaslessEnabled && FULL_GASLESS_CHAINS.includes(chain.id)) {
		return { isLoading, isSuccess, data, deploy };
	}

	return withGasCall;
};

export default useDeploy;
