import { CurrencySelect, TokenSelect } from 'components';
import { Option } from 'components/Select/Select.types';
import { useFormErrors } from 'hooks';
import { Errors } from 'models/errors';
import { useEffect, useState } from 'react';

import { SetupListStepProps } from './Listing.types';
import StepLayout from './StepLayout';

const Setup = ({ list, updateList, tokenId, currencyId }: SetupListStepProps) => {
	const { token, currency, type } = list;
	const [lastToken, setLastToken] = useState<Option | undefined>(token);
	const [lastCurrency, setLastCurrency] = useState<Option | undefined>(currency);
	const { errors, clearErrors, validate } = useFormErrors();

	const updateToken = (t: Option | undefined) => {
		clearErrors(['token']);
		setLastToken(t);
	};

	const updateCurrency = (c: Option | undefined) => {
		clearErrors(['currency']);
		setLastCurrency(c);
	};

	useEffect(() => {
		updateList({
			...list,
			...{
				currency: lastCurrency,
				fiatCurrencyId: lastCurrency?.id,
				token: lastToken,
				tokenId: lastToken?.id,
				margin: list.marginType === 'fixed' ? undefined : list.margin
			}
		});
	}, [lastToken, lastCurrency]);

	const resolver = () => {
		const error: Errors = {};
		if (!token) {
			error.token = 'Should be present';
		}

		if (!currency) {
			error.currency = 'Should be present';
		}
		return error;
	};

	const onProceed = () => {
		if (validate(resolver)) {
			updateList({ ...list, ...{ step: list.step + 1 } });
		}
	};
	return (
		<StepLayout onProceed={onProceed}>
			<TokenSelect
				onSelect={updateToken}
				selected={token}
				error={errors.token}
				selectedIdOnLoad={tokenId as string}
				label={type === 'BuyList' ? 'Choose token to receive' : undefined}
			/>
			<CurrencySelect
				onSelect={updateCurrency}
				selected={currency}
				error={errors.currency}
				selectedIdOnLoad={currencyId as string}
				label={type === 'BuyList' ? 'Choose Fiat currency to pay with' : undefined}
			/>
		</StepLayout>
	);
};

export default Setup;
