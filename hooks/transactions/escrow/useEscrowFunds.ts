import { constants } from 'ethers';

import useNetwork from 'hooks/useNetwork';
import { FULL_GASLESS_CHAINS } from 'models/networks';
import { UseEscrowFundsProps } from '../types';
import useEscrowWithGas from './useEscrowWithGas';
import useGaslessEscrow from './useGaslessEscrow';
import useAccount from 'hooks/useAccount';
import { tronWebClient } from 'utils';
import { OpenPeerEscrow } from 'abis';

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
		// @TODO: Enviar TRX para o contracto
		// token.address === constants.AddressZero
		// ? await contractInstance.populateTransaction.createNativeEscrow(
		// 		orderID,
		// 		buyer,
		// 		amount,
		// 		partner,
		// 		sellerWaitingTime,
		// 		instantEscrow
		// 	)
		// : await contractInstance.populateTransaction.createERC20Escrow(
		// 		orderID,
		// 		buyer,
		// 		token.address,
		// 		amount,
		// 		partner,
		// 		sellerWaitingTime,
		// 		instantEscrow
		// 	);
		const response = await instance.deploy().send({
			useForceRelay: true,
			useSignType: 'personal_trx'
		});
		console.log(response);
		return response;
	};

	return { isLoading: false, isSuccess: false, isFetching: false, escrowFunds: tronEscrowFunds };
};

export default useEscrowFunds;
