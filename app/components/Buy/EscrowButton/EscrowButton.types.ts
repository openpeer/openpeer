import { Token } from 'models/types';

export interface EscrowFundsParams {
	uuid: `0x${string}`;
	buyer: `0x${string}`;
	token: Token;
	tokenAmount: number;
}

export interface EscrowFundsButtonProps extends EscrowFundsParams {
	fee: bigint;
	contract: `0x${string}`;
}
