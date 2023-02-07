import { Escrow, List, Order, User } from 'models/types';

export interface UIOrder {
	step: number;
	list?: List;
	listId?: number;
	fiatAmount?: number | undefined;
	tokenAmount?: number | undefined;
	price?: number | undefined;
	buyer?: User;
	status?: Order['status'];
	tx_hash?: Order['tx_hash'];
	uuid?: `0x${string}`;
	escrow?: Escrow;
}

export interface BuyStepProps {
	order: UIOrder;
	updateOrder: (t: UIOrder) => void;
}
