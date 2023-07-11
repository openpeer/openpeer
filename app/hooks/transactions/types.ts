import { Token } from 'models/types';

export interface UseEscrowTransactionProps {
	contract: `0x${string}`;
	orderID: `0x${string}`;
	buyer: `0x${string}`;
	amount: bigint;
	token: Token;
}

export interface UseEscrowFundsProps extends UseEscrowTransactionProps {
	fee: bigint;
}

export interface UseOpenDisputeProps extends UseEscrowTransactionProps {
	disputeFee: bigint;
}

export interface UseEscrowCancelProps extends UseEscrowTransactionProps {
	isBuyer: boolean;
}
