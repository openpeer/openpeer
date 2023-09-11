import { UIPaymentMethod } from 'components/Listing/Listing.types';
import { Order } from 'models/types';

export interface UIOrder extends Order {
	step: number;
	paymentMethod: UIPaymentMethod | undefined;
}

export interface BuyStepProps {
	order: UIOrder;
	updateOrder: (t: UIOrder) => void;
}
