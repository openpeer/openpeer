import { Option } from 'components/Select/Select.types';
import { List, PaymentMethod, User } from 'models/types';

export interface UIPaymentMethod {
	id: number | undefined;
	bank: Option | undefined;
	values: PaymentMethod['values'];
}

export interface UIList {
	id: number | undefined;
	type: 'BuyList' | 'SellList';
	step: number;
	token: Option | undefined;
	tokenId: number | undefined;
	currency: Option | undefined;
	fiatCurrencyId: number | undefined;
	totalAvailableAmount: number | undefined;
	marginType: List['margin_type'];
	margin: number | undefined;
	limitMin: number | undefined;
	limitMax: number | undefined;
	paymentMethod: UIPaymentMethod | undefined;
	terms?: string | undefined;
	quickSellSetupDone: boolean;
	user?: User;
}

export interface ListStepProps {
	list: UIList;
	updateList: (t: UIList) => void;
}

export interface SetupListStepProps extends ListStepProps {
	tokenId: string | string[] | undefined;
	currencyId: string | string[] | undefined;
}

export interface AmountStepProps extends ListStepProps {
	tokenAmount: string | string[] | undefined;
}
