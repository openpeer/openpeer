import { BigNumber } from 'ethers';
import { isHexString } from 'ethers/lib/utils';
import utf8 from 'utf8';

import { Web3Provider } from '@ethersproject/providers';

import { Domain, GetTransactionDataProps, TransactionMessage } from './signing.types';

const domainType = [
	{ name: 'name', type: 'string' },
	{ name: 'version', type: 'string' },
	{ name: 'verifyingContract', type: 'address' },
	{ name: 'salt', type: 'bytes32' }
];

const metaTransactionType = [
	{ name: 'nonce', type: 'uint256' },
	{ name: 'from', type: 'address' },
	{ name: 'functionSignature', type: 'bytes' }
];

export const call = (provider: any, to: string, data: string) =>
	provider.send('eth_call', [
		{
			to,
			data
		},
		'latest'
	]);

export const hexToUtf8 = (hex: string) => {
	let str = '';
	let code = 0;
	let hexadecimal = hex;
	hexadecimal = hexadecimal.replace(/^0x/i, '');

	// remove 00 padding from either side
	hexadecimal = hexadecimal.replace(/^(?:00)*/, '');
	hexadecimal = hexadecimal.split('').reverse().join('');
	hexadecimal = hexadecimal.replace(/^(?:00)*/, '');
	hexadecimal = hexadecimal.split('').reverse().join('');

	const l = hexadecimal.length;

	for (let i = 0; i < l; i += 2) {
		code = parseInt(hexadecimal.substr(i, 2), 16);
		// if (code !== 0) {
		str += String.fromCharCode(code);
		// }
	}

	return utf8.decode(str);
};

export const getChainId = async (provider: any): Promise<any> => provider.send('eth_chainId');

const getDomain = (name: string, token: `0x${string}` | Domain, chainId: number): Domain => {
	if (typeof token !== 'string') {
		return token as Domain;
	}

	const tokenAddress = token as `0x${string}`;

	const salt = `0x${chainId.toString(16).padStart(64, '0')}` as `0x${string}`;
	const domain: Domain = { name, version: '1', salt, verifyingContract: tokenAddress };
	return domain;
};

export const getSignatureParameters = (signature: string) => {
	if (!isHexString(signature)) {
		throw new Error('Given value "'.concat(signature, '" is not a valid hex string.'));
	}
	const r = signature.slice(0, 66);
	const s = '0x'.concat(signature.slice(66, 130));
	const v = '0x'.concat(signature.slice(130, 132));
	let numericV = BigNumber.from(v).toNumber();
	if (![27, 28].includes(numericV)) numericV += 27;
	return {
		r,
		s,
		v: numericV
	};
};

export const signGaslessTransaction = async ({
	userAddress,
	contract,
	name,
	nonce,
	chainId,
	functionSignature
}: GetTransactionDataProps) => {
	const message: TransactionMessage = { nonce: parseInt(nonce.toString(), 10), from: userAddress, functionSignature };

	const domainData = getDomain(name, contract, chainId);

	const data = {
		types: {
			EIP712Domain: domainType,
			MetaTransaction: metaTransactionType
		},
		domain: domainData,
		primaryType: 'MetaTransaction',
		message
	};

	const dataToSign = JSON.stringify(data);

	const ethersProvider = new Web3Provider(window.ethereum as any);
	const signature = await ethersProvider.send('eth_signTypedData_v3', [userAddress, dataToSign]);
	return getSignatureParameters(signature);
};
