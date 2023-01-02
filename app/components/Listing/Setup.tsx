import { CurrencySelect, TokenSelect } from 'components';
import { Option } from 'components/Select/Select.types';

import { StepProps } from './Listing.types';
import StepLayout from './StepLayout';

const Setup = ({ list, updateList }: StepProps) => {
  const { token, currency } = list;
  const updateToken = (t: Option | undefined) => {
    updateList({ ...list, ...{ token: t } });
  };
  const updateCurrency = (c: Option | undefined) => {
    updateList({ ...list, ...{ currency: c, margin: undefined } });
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
