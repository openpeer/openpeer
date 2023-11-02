import { Token } from 'models/types';

export interface WithdrawFundsButtonProps {
	token: Token;
	tokenAmount: number;
	contract: `0x${string}`;
	disabled?: boolean;
}
