import { OpenPeerDeployer } from 'abis';
import { BigNumber, Contract } from 'ethers';
import useBiconomy from 'hooks/useBiconomy';
import { useState } from 'react';
import { useAccount } from 'wagmi';

interface UseGaslessEscrowProps {
	orderID: `0x${string}`;
	contract: `0x${string}`;
	buyer: `0x${string}`;
	tokenAddress: `0x${string}`;
	amount: BigNumber;
}

interface Data {
	hash?: `0x${string}`;
}

const useGaslessEscrow = ({ contract, orderID, buyer, tokenAddress, amount }: UseGaslessEscrowProps) => {
	const [data, updateData] = useState<Data>({});
	const [isSuccess, setIsSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { address } = useAccount();

	const { biconomy, gaslessEnabled } = useBiconomy({ contract });

	if (biconomy === undefined) {
		return { isFetching: true, gaslessEnabled, isSuccess, isLoading, data };
	}

	if (biconomy === null || !gaslessEnabled) {
		return { isFetching: false, gaslessEnabled: false, isSuccess, isLoading, data };
	}

	const escrowFunds = async () => {
		try {
			const provider = await biconomy.provider;
			const contractInstance = new Contract(contract, OpenPeerDeployer, biconomy.ethersProvider);
			const { data: transactionData } = await contractInstance.populateTransaction.deployERC20Escrow(
				orderID,
				buyer,
				tokenAddress,
				amount
			);
			const txParams = {
				data: transactionData,
				to: contract,
				from: address,
				signatureType: 'EIP712_SIGN',
				gasLimit: 420000
			};
			// @ts-ignore
			await provider.send('eth_sendTransaction', [txParams]);
			setIsLoading(true);
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
