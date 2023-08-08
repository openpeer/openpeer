import { Option } from 'components/Select/Select.types';
import { Chain } from 'wagmi';

import { FiatCurrency, Token } from './types';

export interface SearchFilters {
	amount: number | undefined;
	currency: FiatCurrency | undefined;
	paymentMethod: Option | undefined;
	token: Token | undefined;
	fiatAmount: number | undefined;
	chain: Chain | undefined;
}
