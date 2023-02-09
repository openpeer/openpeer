import { CurrencySelect, TokenSelect } from 'components';
import { Option } from 'components/Select/Select.types';
import { useFormErrors } from 'hooks';
import { Errors } from 'models/errors';

import { ListStepProps } from './Listing.types';
import StepLayout from './StepLayout';

const Setup = ({ list, updateList }: ListStepProps) => {
	const { token, currency } = list;
	const { errors, clearErrors, validate } = useFormErrors();

	const updateToken = (t: Option | undefined) => {
		clearErrors(['token']);
		updateList({ ...list, ...{ token: t, tokenId: t?.id } });
	};
	const updateCurrency = (c: Option | undefined) => {
		clearErrors(['currency']);
		updateList({ ...list, ...{ currency: c, fiatCurrencyId: c?.id, margin: undefined } });
	};

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
			<TokenSelect onSelect={updateToken} selected={token} error={errors.token} />
			<CurrencySelect onSelect={updateCurrency} selected={currency} error={errors.currency} />
		</StepLayout>
	);
};

export default Setup;
