import { BigNumber } from 'ethers';
import { DEPLOYER_CONTRACTS } from 'models/networks';
import { Token } from 'models/types';
import { useNetwork } from 'wagmi';

import useCreateContract from './useCreateContract';
import useGaslessEscrow from './useGaslessEscrow';

interface UseEscrowFundsPros {
	orderID: `0x${string}`;
	buyer: `0x${string}`;
	amount: BigNumber;
	fee: BigNumber;
	token: Token;
}

const useEscrowFunds = ({ orderID, buyer, amount, token, fee }: UseEscrowFundsPros) => {
	const { gasless } = token;
	const { chain } = useNetwork();
	const contract = DEPLOYER_CONTRACTS[chain?.id!];

	const withGasCall = useCreateContract({
		orderID,
		contract,
		buyer,
		amount,
		token,
		fee
	});

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, escrowFunds } = useGaslessEscrow({
		amount,
		buyer,
		contract,
		orderID,
		tokenAddress: token.address
	});

	if (gasless && !isFetching && gaslessEnabled) {
		return { isLoading, isSuccess, data, escrowFunds };
	}

	return withGasCall;
};

export default useEscrowFunds;
