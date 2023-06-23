import { Option } from 'components/Select/Select.types';

import { FiatCurrency, Token } from './types';

export interface SearchFilters {
	amount: number | undefined;
	currency: FiatCurrency | undefined;
	paymentMethod: Option | undefined;
	token: Token | undefined;
	fiatAmount: number | undefined;
}
