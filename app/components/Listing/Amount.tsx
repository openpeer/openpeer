import { Input, Label, MarginSwitcher } from 'components';
import { useState } from 'react';

import { StepProps } from './Listing.types';
import StepLayout from './StepLayout';

const Amount = ({ list, updateList }: StepProps) => {
  const {
    token,
    currency,
    totalAvailableAmount,
    limitMin,
    limitMax,
    marginType = 'fixed'
  } = list;

  const [percentageMargin, setPercentageMargin] = useState<number>(5);
  const [fixedMargin, setFixedMargin] = useState<number>(1.1);
  const margin = marginType === 'percentage' ? percentageMargin : fixedMargin;
  const updateMargin = (m: number) => {
    marginType === 'percentage' ? setPercentageMargin(m) : setFixedMargin(m);
    updateList({ ...list, ...{ margin } });
  };

  const onProceed = () => {
    const total = totalAvailableAmount || 0;
    const min = limitMin || 0;
    const max = limitMax || 0;
    if (total > 0 && min <= max && (margin > 0 || marginType === 'percentage')) {
      updateList({ ...list, ...{ step: list.step + 1 } });
    }
  };

  return (
    <StepLayout onProceed={onProceed}>
      <Input
        label="Enter total available crypto amount"
        addOn={token!.name}
        id="price"
        value={totalAvailableAmount}
        onChange={(n) => updateList({ ...list, ...{ totalAvailableAmount: Number(n) } })}
        type="number"
        required
      />
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Enter fiat order limit
        </label>
        <div className="flex flex-row gap-x-8">
          <Input
            placeholder="100"
            label="Min:"
            addOn={currency!.name}
            id="minPrice"
            type="number"
            value={limitMin}
            onChange={(n) => updateList({ ...list, ...{ limitMin: Number(n) } })}
          />
          <Input
            placeholder="1000"
            label="Max:"
            addOn={currency!.name}
            id="maxPrice"
            type="number"
            value={limitMax}
            onChange={(n) => updateList({ ...list, ...{ limitMax: Number(n) } })}
          />
        </div>
      </div>

      <Label title="Set Price Margin" />
      <MarginSwitcher
        selected={marginType}
        onSelect={(t) => updateList({ ...list, ...{ marginType: t } })}
        currency={currency!.name}
        token={token!.name}
        margin={margin}
        updateMargin={updateMargin}
      />

      <div className="w-full flex flex-row justify-between mb-8 hidden">
        <div>
          <div>Lowest price</div>
          <div className="text-xl font-bold">25.9 {list.currency!.name}</div>
        </div>
        <div>
          <div>Highest price</div>
          <div className="text-xl font-bold">25.9 {list.currency!.name}</div>
        </div>
      </div>
    </StepLayout>
  );
};

export default Amount;
