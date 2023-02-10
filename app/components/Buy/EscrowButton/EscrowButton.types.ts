import { BigNumber } from 'ethers';
import { Token } from 'models/types';

export interface EscrowFundsParams {
	uuid: `0x${string}`;
	buyer: `0x${string}`;
	token: Token;
	tokenAmount: number;
}

export interface EscrowFundsButton extends EscrowFundsParams {
	fee: BigNumber;
}
