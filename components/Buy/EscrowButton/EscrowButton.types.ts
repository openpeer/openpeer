import { Token } from 'models/types';

export interface EscrowFundsParams {
	uuid: `0x${string}`;
	buyer: `0x${string}`;
	seller: `0x${string}`;
	token: Token;
	tokenAmount: number;
	instantEscrow: boolean;
	sellerWaitingTime: number;
}

export interface EscrowFundsButtonProps extends EscrowFundsParams {
	fee: bigint;
	contract: `0x${string}`;
}
