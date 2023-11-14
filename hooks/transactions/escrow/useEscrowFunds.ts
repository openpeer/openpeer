import { constants } from 'ethers';

import { useNetwork } from 'wagmi';
import { FULL_GASLESS_CHAINS } from 'models/networks';
import { UseEscrowFundsProps } from '../types';
import useEscrowWithGas from './useEscrowWithGas';
import useGaslessEscrow from './useGaslessEscrow';

const useEscrowFunds = ({
	orderID,
	buyer,
	amount,
	token,
	fee,
	contract,
	instantEscrow,
	sellerWaitingTime
}: UseEscrowFundsProps) => {
	const nativeToken = token.address === constants.AddressZero;
	const { chain } = useNetwork();

	const withGasCall = useEscrowWithGas({
		orderID,
		contract,
		buyer,
		amount,
		token,
		fee,
		instantEscrow,
		sellerWaitingTime
	});

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, escrowFunds } = useGaslessEscrow({
		amount,
		buyer,
		contract,
		orderID,
		token,
		instantEscrow,
		sellerWaitingTime
	});

	if (isFetching || !chain) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	// gasless enabled on Biconomy
	// polygon or mumbai deploy gasless non native tokens or instant escrows (no tokens transferred to escrow contract)
	// other chains: deploy gasless if instant escrow (no tokens transferred to escrow contract)

	if (gaslessEnabled && (FULL_GASLESS_CHAINS.includes(chain.id) ? !nativeToken || instantEscrow : instantEscrow)) {
		console.log('gasless enabled', gaslessEnabled);
		return { isLoading, isSuccess, data, escrowFunds };
	}

	return withGasCall;
};

export default useEscrowFunds;
