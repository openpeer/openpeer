import { List } from 'models/types';

export interface UIOrder {
	step: number;
	list?: List;
	fiatAmount?: number | undefined;
	tokenAmount?: number | undefined;
}

export interface BuyStepProps {
	order: UIOrder;
	updateOrder: (t: UIOrder) => void;
}
