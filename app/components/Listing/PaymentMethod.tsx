import { BankSelect, Button, Input } from 'components';

import { PencilSquareIcon } from '@heroicons/react/24/outline';

import { StepProps } from './Listing.types';
import StepLayout from './StepLayout';

const PaymentMethod = ({ list, updateList }: StepProps) => {
  const { currency, bank } = list;

  const onProceed = () => {
    if (true) {
      updateList({ ...list, ...{ step: list.step + 1 } });
    }
  };

  return (
    <StepLayout onProceed={onProceed}>
      <h2 className="text-xl mt-8">Payment Method</h2>
      <p>Choose how you want to receive your money</p>
      <Input label="Account Name" type="text" name="user_name" placeholder="Josh Adam" />
      <Input
        label="Account Number"
        type="tel"
        name="user_account_number"
        placeholder="1000"
      />
      <BankSelect
        currencyId={currency!.id}
        onSelect={(b) => updateList({ ...list, ...{ bank: b } })}
        selected={bank}
      />

      <div className="hidden">
        <div className="w-full flex flex-col bg-gray-100 mt-8 py-4 p-8 border-2 border-slate-200 rounded-md">
          <div className="w-full flex flex-row justify-between mb-4">
            <div>Bank Transfer</div>
            <div>
              <PencilSquareIcon className="h-5 w-" aria-hidden="true" />
            </div>
          </div>
          <div className="mb-4">
            <div>Josh Adam</div>
            <div></div>
          </div>
          <div className="w-full flex flex-row justify-between">
            <div>09909999994</div>
            <div>Bank</div>
          </div>
        </div>
        <Button title="Add New Payment Method +" outlined />
      </div>
    </StepLayout>
  );
};

export default PaymentMethod;
