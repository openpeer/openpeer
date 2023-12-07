import { DEPLOYER_CONTRACTS, FULL_GASLESS_CHAINS } from 'models/networks';
import useNetwork from 'hooks/useNetwork';
import useAccount from 'hooks/useAccount';
import { tronWebClient } from 'utils';
import { TronSave } from '@tronsave/sdk';

import useDeployWithGas from './useDeployWithGas';
import useGaslessDeploy from './useGaslessDeploy';

const useDeploy = () => {
	const { chain } = useNetwork();
	const { evm } = useAccount();
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

	if (evm) {
		if (gaslessEnabled && FULL_GASLESS_CHAINS.includes(chain.id)) {
			return { isLoading, isSuccess, data, deploy };
		}

		return withGasCall;
	}

	const tronDeploy = async () => {
		const tronWeb = tronWebClient(chain);
		const tronSave = new TronSave(tronWeb, {
			apiKey: '',
			// network: chain.network as 'mainnet' | 'nile',
			network: 'nile',
			paymentMethodType: 11
		});
		const instance = await tronSave.contract().at(contract);
		const response = await instance.deploy().send({
			useRelay: true,
			useSignType: 'personal_trx'
			// feeLimit: 100_000_000,
			// callValue: 0,
			// shouldPollResponse: true
		});
		console.log(response);
		return response;
	};

	return { isLoading: false, isSuccess: false, isFetching: false, deploy: tronDeploy };
};

export default useDeploy;
