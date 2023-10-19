import { Token } from 'models/types';

export interface UseEscrowTransactionProps {
	contract: `0x${string}`;
	orderID: `0x${string}`;
	buyer: `0x${string}`;
	amount: bigint;
	token: Token;
}

export interface UseEscrowFundsProps extends UseEscrowTransactionProps {
	instantEscrow: boolean;
	fee: bigint;
}

export interface UseOpenDisputeProps extends UseEscrowTransactionProps {
	disputeFee: bigint | undefined;
}

export interface UseEscrowCancelProps extends UseEscrowTransactionProps {
	isBuyer: boolean;
}

export interface UseDepositFundsProps {
	amount: bigint;
	token: Token;
	contract: `0x${string}`;
}
