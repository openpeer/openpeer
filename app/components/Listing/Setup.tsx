import { CurrencySelect, TokenSelect } from 'components';
import { Option } from 'components/Select/Select.types';

import { ListStepProps } from './Listing.types';
import StepLayout from './StepLayout';

const Setup = ({ list, updateList }: ListStepProps) => {
	const { token, currency } = list;
	const updateToken = (t: Option | undefined) => {
		updateList({ ...list, ...{ token: t, tokenId: t?.id } });
	};
	const updateCurrency = (c: Option | undefined) => {
		updateList({ ...list, ...{ currency: c, fiatCurrencyId: c?.id, margin: undefined } });
	};

	const onProceed = () => {
		if (token && currency) {
			updateList({ ...list, ...{ step: list.step + 1 } });
		}
	};

	return (
		<StepLayout onProceed={onProceed}>
			<TokenSelect onSelect={updateToken} selected={token} />
			<CurrencySelect onSelect={updateCurrency} selected={currency} />
		</StepLayout>
	);
};

export default Setup;
