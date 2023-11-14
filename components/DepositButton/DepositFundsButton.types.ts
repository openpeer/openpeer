import { Token } from 'models/types';

export interface DepositFundsParams {
	token: Token;
	tokenAmount: number;
	contract: `0x${string}`;
	disabled?: boolean;
}
