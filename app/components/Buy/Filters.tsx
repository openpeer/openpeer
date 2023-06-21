import Input from 'components/Input/Input';
import BankSelect from 'components/Select/BankSelect';
import CurrencySelect from 'components/Select/CurrencySelect';
import { Option } from 'components/Select/Select.types';
import TokenSelect from 'components/Select/TokenSelect';
import debounce from 'lodash.debounce';
import { SearchFilters } from 'models/search';
import { FiatCurrency, Token } from 'models/types';
import React, { useEffect, useState } from 'react';

import { XMarkIcon } from '@heroicons/react/20/solid';

interface FilterProps {
	onFilterUpdate: (filters: SearchFilters) => void;
}

const Filters = ({ onFilterUpdate }: FilterProps) => {
	const [amount, setAmount] = useState<number>();
	const [token, setToken] = useState<Token>();
	const [currency, setCurrency] = useState<FiatCurrency>();
	const [fiatAmount, setFiatAmount] = useState<number>();
	const [paymentMethod, setPaymentMethod] = useState<Option>();

	useEffect(() => {
		onFilterUpdate({ amount, currency, paymentMethod, token, fiatAmount });
	}, [amount, fiatAmount, paymentMethod, token]);

	useEffect(() => {
		const availableInTheNewCurrency =
			currency &&
			paymentMethod &&
			// @ts-expect-error
			(!paymentMethod.fiat_currency || paymentMethod.fiat_currency.id === currency.id);
		const newPaymentMethod = availableInTheNewCurrency ? paymentMethod : undefined;
		setPaymentMethod(newPaymentMethod);
		onFilterUpdate({ amount, fiatAmount, currency, token, paymentMethod: newPaymentMethod });
	}, [currency]);

	const reset = () => {
		setAmount(undefined);
		setToken(undefined);
		setCurrency(undefined);
		setPaymentMethod(undefined);
		setFiatAmount(undefined);
	};

	return (
		<div className="flex items-center space-x-4">
			<TokenSelect label="Token" onSelect={setToken} selected={token} labelStyle="text-sm" />
			<Input
				label="Token Amount"
				id="amount"
				placeholder="Enter the Token Amount"
				type="decimal"
				value={amount}
				onChangeNumber={debounce(setAmount, 800)}
				labelStyle="text-sm"
			/>
			<CurrencySelect label="Currency" onSelect={setCurrency} selected={currency} labelStyle="text-sm" />
			<Input
				label="Fiat Amount"
				id="fiatAmount"
				placeholder="Enter the Fiat Amount"
				type="decimal"
				value={fiatAmount}
				onChangeNumber={debounce(setFiatAmount, 800)}
				labelStyle="text-sm"
			/>
			<BankSelect
				currencyId={currency?.id || -1}
				onSelect={setPaymentMethod}
				selected={paymentMethod}
				labelStyle="text-sm"
			/>
			<div>
				<XMarkIcon width={24} height={24} className="cursor-pointer" onClick={reset} />
			</div>
		</div>
	);
};

export default Filters;
