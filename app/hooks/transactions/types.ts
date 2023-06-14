import { BigNumber } from 'ethers';
import { Token } from 'models/types';

export interface UseEscrowTransactionProps {
	contract: `0x${string}`;
	orderID: `0x${string}`;
	buyer: `0x${string}`;
	amount: BigNumber;
	token: Token;
}

export interface UseEscrowFundsProps extends UseEscrowTransactionProps {
	fee: BigNumber;
}

export interface UseOpenDisputeProps extends UseEscrowTransactionProps {
	disputeFee: BigNumber;
}

export interface UseEscrowCancelProps extends UseEscrowTransactionProps {
	isBuyer: boolean;
}
