export interface GetContractNonceProps {
	contract: string;
	userAddress: string;
	provider: any;
}

export interface TransactionMessage {
	nonce: number;
	from: string;
	functionSignature: string;
}

export interface GetTransactionDataProps {
	userAddress: `0x${string}`;
	contract: `0x${string}`;
	name: string;
	nonce: bigint;
	chainId: number;
	functionSignature: string;
}

export interface Domain {
	name: string;
	version: string;
	verifyingContract: `0x${string}`;
	salt: `0x${string}`;
}
