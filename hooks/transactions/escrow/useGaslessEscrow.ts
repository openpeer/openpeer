/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/indent */
import { OpenPeerEscrow } from 'abis';
import { constants, Contract } from 'ethers';
import useBiconomy from 'hooks/useBiconomy';
import { useState } from 'react';
import { useAccount } from 'wagmi';

import { UseGaslessEscrowFundsProps } from '../types';

interface Data {
	hash?: `0x${string}`;
}

const useGaslessEscrow = ({
	contract,
	orderID,
	buyer,
	token,
	amount,
	instantEscrow,
	sellerWaitingTime
}: UseGaslessEscrowFundsProps) => {
	const [data, updateData] = useState<Data>({});
	const [isSuccess, setIsSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { address } = useAccount();

	const { biconomy, gaslessEnabled } = useBiconomy({ contract });

	if (biconomy === undefined || gaslessEnabled === undefined) {
		return { isFetching: true, gaslessEnabled, isSuccess, isLoading, data };
	}

	if (biconomy === null || !gaslessEnabled) {
		return { isFetching: false, gaslessEnabled: false, isSuccess, isLoading, data };
	}

	const escrowFunds = async () => {
		try {
			const provider = await biconomy.provider;
			const contractInstance = new Contract(contract, OpenPeerEscrow, biconomy.ethersProvider);
			const partner = constants.AddressZero;
			const { data: transactionData } =
				token.address === constants.AddressZero
					? await contractInstance.populateTransaction.createNativeEscrow(
							orderID,
							buyer,
							amount,
							partner,
							sellerWaitingTime,
							instantEscrow
					  )
					: await contractInstance.populateTransaction.createERC20Escrow(
							orderID,
							buyer,
							token.address,
							amount,
							partner,
							sellerWaitingTime,
							instantEscrow
					  );
			const txParams = {
				data: transactionData,
				to: contract,
				from: '0xeDf2cfD0A8da2891eA0f2b187EBa298A366A100d',
				signatureType: 'EIP712_SIGN'
			};
			// @ts-ignore
			await provider.send('eth_sendTransaction', [txParams]);
			setIsLoading(true);
			biconomy.on('txHashGenerated', (txData) => {
				setIsSuccess(false);
				updateData(txData);
			});
			biconomy.on('txMined', (minedData) => {
				setIsLoading(false);
				setIsSuccess(true);
				updateData(minedData);
			});

			biconomy.on('onError', (minedData) => {
				console.error('error', minedData);
				setIsLoading(false);
				setIsSuccess(false);
			});
		} catch (error) {
			console.error('error', error);
			setIsLoading(false);
			setIsSuccess(false);
		}
	};
	return { isFetching: false, gaslessEnabled: true, isLoading, isSuccess, data, escrowFunds };
};

export default useGaslessEscrow;
