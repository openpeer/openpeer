import { List } from 'models/types';

export interface UIOrder {
	step: number;
	list?: List;
}

export interface BuyStepProps {
	order: UIOrder;
	updateOrder: (t: UIOrder) => void;
}
