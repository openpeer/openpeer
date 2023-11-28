import { OpenPeerEscrow } from 'abis';
import { Contract } from 'ethers';
import useBiconomy from 'hooks/useBiconomy';
import { useState } from 'react';
import useAccount from 'hooks/useAccount';

import { UseEscrowTransactionProps } from '../types';

interface Data {
	hash?: `0x${string}`;
}

const useGaslessMarkAsPaid = ({ orderID, buyer, amount, token, contract }: UseEscrowTransactionProps) => {
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

	const markAsPaid = async () => {
		try {
			const provider = await biconomy.provider;
			const contractInstance = new Contract(contract, OpenPeerEscrow, biconomy.ethersProvider);
			const { data: transactionData } = await contractInstance.populateTransaction.markAsPaid(
				orderID,
				buyer,
				token.address,
				amount
			);
			const txParams = {
				data: transactionData,
				to: contract,
				from: address,
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
	return { isFetching: false, gaslessEnabled: true, isLoading, isSuccess, data, markAsPaid };
};

export default useGaslessMarkAsPaid;
