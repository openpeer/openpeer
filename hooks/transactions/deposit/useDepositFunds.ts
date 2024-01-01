import { constants } from 'ethers';

import { FULL_GASLESS_CHAINS } from 'models/networks';
import useAccount from 'hooks/useAccount';
import useNetwork from 'hooks/useNetwork';
import { tronWebClient } from 'utils';
import { OpenPeerEscrow } from 'abis';
import { UseDepositFundsProps } from '../types';
import useDepositWithGas from './useDepositWithGas';
import useGaslessDepositFunds from './useGaslessDepositFunds';

const useDepositFunds = ({ amount, token, contract }: UseDepositFundsProps) => {
	const nativeToken = token.address === constants.AddressZero;
	const { evm } = useAccount();
	const { chain } = useNetwork();

	const withGasCall = useDepositWithGas({
		contract,
		amount,
		token
	});

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, depositFunds } = useGaslessDepositFunds({
		amount,
		contract,
		token
	});

	if (isFetching || !chain) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (evm) {
		if (!nativeToken && gaslessEnabled && FULL_GASLESS_CHAINS.includes(chain.id)) {
			return { isLoading, isSuccess, data, depositFunds };
		}

		return withGasCall;
	}

	const tronDepositFunds = async () => {
		const tronWeb = tronWebClient(chain);
		// const tronSave = new TronSave(tronWeb, {
		// apiKey: process.env[`NEXT_PUBLIC_TRON_SAVE_API_KEY_${chain.network.toUpperCase()}`],
		// network: chain.network as 'mainnet' | 'nile',
		// paymentMethodType: 11
		// }); // @TODO: Add TronSave support
		const instance = await tronWeb.contract(OpenPeerEscrow, contract);
		const response = await instance.deposit(token.address, amount).send({
			value: nativeToken ? amount : undefined,
			useForceRelay: false,
			useSignType: 'personal_trx'
		});
		return response;
	};

	return { isLoading: false, isSuccess: false, isFetching: false, depositFunds: tronDepositFunds };
};

export default useDepositFunds;
