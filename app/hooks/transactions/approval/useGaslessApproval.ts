import { Interface } from 'ethers/lib/utils';
import useBiconomy from 'hooks/useBiconomy';
import { sendSignedTransaction } from 'models/transactions';
import { useState } from 'react';
import { signGaslessTransaction } from 'utils/signing/signing';
import { parseAbi } from 'viem';
import { Chain, useContractReads } from 'wagmi';

interface ApproveTokenProps {
	chain: Chain;
	tokenAddress: `0x${string}`;
	userAddress: `0x${string}`;
	spender: `0x${string}`;
	amount: bigint;
}

const noncesAbi = parseAbi([
	'function name() public view returns (string name)',
	'function getNonce(address user) public view returns (uint256 nonce)',
	'function _nonces(address user) public view returns (uint256)',
	'function nonces(address user) public view returns (uint256)'
]);

interface Data {
	hash?: `0x${string}`;
}

const useGaslessApproval = ({ chain, tokenAddress, userAddress, spender, amount }: ApproveTokenProps) => {
	const [data, updateData] = useState<Data>({});
	const [isSuccess, setIsSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const { biconomy, gaslessEnabled } = useBiconomy({ contract: tokenAddress });

	const tokenContract = { address: tokenAddress, abi: noncesAbi };
	const {
		data: reads,
		isFetching,
		isSuccess: dataReadSuccess
	} = useContractReads({
		contracts: [
			{ ...tokenContract, functionName: 'name' },
			{ ...tokenContract, functionName: 'getNonce', args: [userAddress] },
			{ ...tokenContract, functionName: '_nonces', args: [userAddress] },
			{ ...tokenContract, functionName: 'nonces', args: [userAddress] }
		]
	});

	if (isFetching || biconomy === undefined || gaslessEnabled === undefined) {
		return { isFetching: true, gaslessEnabled, isSuccess, isLoading, data };
	}

	const [nameResult, getNonceResult, nonces2Result, nonces3Result] = reads || [];
	const name = (nameResult?.result || '') as string;
	const getNonce = getNonceResult?.result as unknown;
	const noncesResult = nonces2Result?.result || nonces3Result?.result;
	const nonce = (getNonce || noncesResult || noncesResult) as bigint;

	if (biconomy === null || !gaslessEnabled || (dataReadSuccess && (!name || !nonce))) {
		return { isFetching, gaslessEnabled: false, isSuccess, isLoading, data };
	}

	const approve = async () => {
		const abi = ['function approve(address spender, uint256 amount) external returns (bool)'];
		const contractInterface = new Interface(abi);
		const functionSignature = contractInterface.encodeFunctionData('approve', [spender, amount]);
		const { r, s, v } = await signGaslessTransaction({
			userAddress,
			contract: tokenAddress,
			name: name!,
			nonce: nonce!,
			chainId: chain.id,
			functionSignature
		});

		try {
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

			sendSignedTransaction({
				biconomy,
				userAddress,
				tokenAddress,
				functionSignature,
				r,
				s,
				v
			});
		} catch (error) {
			console.error('error', error);
			setIsLoading(false);
			setIsSuccess(false);
		}
	};
	return { isFetching: false, gaslessEnabled: true, isLoading, isSuccess, data, approve };
};

export default useGaslessApproval;
