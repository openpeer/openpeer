import { DEPLOYER_CONTRACTS } from 'models/networks';
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

	if (isFetching) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (gaslessEnabled) {
		return { isLoading, isSuccess, data, deploy };
	}

	return withGasCall;
};

export default useDeploy;
