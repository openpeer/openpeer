import { constants } from 'ethers';

import useNetwork from 'hooks/useNetwork';
import { FULL_GASLESS_CHAINS } from 'models/networks';
import useAccount from 'hooks/useAccount';
import { tronWebClient } from 'utils';
import { OpenPeerEscrow } from 'abis';
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
	const { evm } = useAccount();
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

	if (evm) {
		// gasless enabled on Biconomy. Polygon or mumbai deploy gasless non native tokens or
		// instant escrows (no tokens transferred to escrow contract)
		// other chains: deploy gasless if instant escrow (no tokens transferred to escrow contract)

		if (
			gaslessEnabled &&
			(FULL_GASLESS_CHAINS.includes(chain.id) ? !nativeToken || instantEscrow : instantEscrow)
		) {
			return { isLoading, isSuccess, data, escrowFunds };
		}

		return withGasCall;
	}

	const tronEscrowFunds = async () => {
		const tronWeb = tronWebClient(chain);
		const instance = await tronWeb.contract(OpenPeerEscrow, contract);
		let response;
		if (nativeToken) {
			response = await instance
				.createNativeEscrow(orderID, buyer, amount, constants.AddressZero, sellerWaitingTime, instantEscrow)
				.send({
					useForceRelay: true,
					useSignType: 'personal_trx'
				});
		} else {
			response = await instance
				.createERC20Escrow(
					orderID,
					buyer,
					token.address,
					amount,
					constants.AddressZero,
					sellerWaitingTime,
					instantEscrow
				)
				.send({
					useForceRelay: true,
					useSignType: 'personal_trx'
				});
		}
		console.log(response);
		return response;
	};

	return { isLoading: false, isSuccess: false, isFetching: false, escrowFunds: tronEscrowFunds };
};

export default useEscrowFunds;
