import { Order } from 'models/types';

export interface UIOrder extends Order {
	step: number;
}

export interface BuyStepProps {
	order: UIOrder;
	updateOrder: (t: UIOrder) => void;
}
