import { Token } from 'models/types';
import useAccount from 'hooks/useAccount';
import useNetwork from 'hooks/useNetwork';

import { tronWebClient } from 'utils';
import { TronSave } from '@tronsave/sdk';
import useGaslessApproval from './useGaslessApproval';
import useTokenApproval from './useTokenApproval';

interface UseTokenApprovalProps {
	token: Token;
	spender: `0x${string}`;
	amount: bigint;
}

const useApproval = ({ token, spender, amount }: UseTokenApprovalProps) => {
	const { gasless } = token;
	const { address, evm } = useAccount();
	const { chain } = useNetwork();

	const withGasCall = useTokenApproval({
		address: token.address,
		spender,
		amount
	});

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, approve } = useGaslessApproval({
		amount,
		chain,
		spender,
		tokenAddress: token.address,
		userAddress: address!
	});

	if (isFetching || !chain) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (evm) {
		if (gasless && gaslessEnabled) {
			return { isLoading, isSuccess, data, approve, isFetching };
		}

		return withGasCall;
	}

	const tronApprove = async () => {
		const tronWeb = tronWebClient(chain);
		const tronSave = new TronSave(tronWeb, {
			apiKey: process.env[`NEXT_PUBLIC_TRON_SAVE_API_KEY_${chain.network.toUpperCase()}`],
			network: chain.network as 'mainnet' | 'nile',
			paymentMethodType: 11
		});
		const instance = await (gasless ? tronSave : tronWeb).contract().at(token.address);
		const response = await instance.approve(spender, amount).send({
			useForceRelay: false,
			useSignType: 'personal_trx'
		});
		return response;
	};

	return { isLoading: false, isSuccess: false, isFetching: false, approve: tronApprove };
};
export default useApproval;
