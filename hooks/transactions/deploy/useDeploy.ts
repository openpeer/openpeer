import { DEPLOYER_CONTRACTS } from 'models/networks';
import { useNetwork } from 'wagmi';

import useDeployWithGas from './useDeployWithGas';
import useGaslessDeploy from './useGaslessDeploy';

const useDeploy = () => {
	const { chain } = useNetwork();
	console.log('Inside useDeploy.ts chain: ', chain);
	const contract = DEPLOYER_CONTRACTS[chain?.id!];
	console.log('Inside useDeploy.ts chain: ', contract);

	const withGasCall = useDeployWithGas({
		contract
	});
	console.log('Inside useDeploy.ts chain: ', withGasCall);

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, deploy } = useGaslessDeploy({
		contract
	});

	console.log('Inside useDeploy.ts gasless: ', { gaslessEnabled, isFetching, isLoading, isSuccess, data, deploy });

	if (isFetching) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (gaslessEnabled) {
		return { isLoading, isSuccess, data, deploy };
	}

	return withGasCall;
};

export default useDeploy;
