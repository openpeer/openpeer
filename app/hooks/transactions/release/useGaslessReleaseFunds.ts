import { OpenPeerEscrow } from 'abis';
import { Contract } from 'ethers';
import useBiconomy from 'hooks/useBiconomy';
import { useState } from 'react';
import { useAccount } from 'wagmi';

interface UseGaslessReleaseFundsProps {
	contract: `0x${string}`;
}

interface Data {
	hash?: `0x${string}`;
}

const useGaslessReleaseFunds = ({ contract }: UseGaslessReleaseFundsProps) => {
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

	const releaseFunds = async () => {
		try {
			const provider = await biconomy.provider;
			const contractInstance = new Contract(contract, OpenPeerEscrow, biconomy.ethersProvider);
			const { data } = await contractInstance.populateTransaction.release();
			const txParams = {
				data,
				to: contract,
				from: address,
				signatureType: 'EIP712_SIGN',
				gasLimit: 200000
			};
			// @ts-ignore
			const tx = await provider.send('eth_sendTransaction', [txParams]);
			setIsLoading(true);
			biconomy.on('txMined', (data: any) => {
				setIsLoading(false);
				setIsSuccess(true);
				updateData(data);
			});

			biconomy.on('onError', (data: any) => {
				console.error('error', data);
				setIsLoading(false);
				setIsSuccess(false);
			});
		} catch (error) {
			console.error('error', error);
			setIsLoading(false);
			setIsSuccess(false);
		}
	};
	return { isFetching: false, gaslessEnabled: true, isLoading, isSuccess, data, releaseFunds };
};

export default useGaslessReleaseFunds;
