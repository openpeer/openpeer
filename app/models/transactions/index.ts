import { Contract } from 'ethers';

import { Biconomy } from '@biconomy/mexa';

interface SendTransactionProps {
	biconomy: Biconomy;
	tokenAddress: `0x${string}`;
	userAddress: `0x${string}`;
	functionSignature: string;
	r: string;
	s: string;
	v: number;
}

const metaTransactionAbi = [
	// eslint-disable-next-line max-len
	'function executeMetaTransaction(address userAddress, bytes memory functionSignature, bytes32 sigR, bytes32 sigS, uint8 sigV) external payable returns (bytes memory) '
];

export const sendSignedTransaction = async ({
	biconomy,
	tokenAddress,
	userAddress,
	functionSignature,
	r,
	s,
	v
}: SendTransactionProps) => {
	console.log('Sending transaction via Biconomy');
	const provider = await biconomy.provider;
	const contractInstance = new Contract(tokenAddress, metaTransactionAbi, biconomy.ethersProvider);
	const { data } = await contractInstance.populateTransaction.executeMetaTransaction(
		userAddress,
		functionSignature,
		r,
		s,
		v
	);
	const txParams = {
		data,
		to: tokenAddress,
		from: userAddress,
		signatureType: 'EIP712_SIGN'
	};
	// @ts-ignore
	await provider.send('eth_sendTransaction', [txParams]);
};
