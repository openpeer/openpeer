import { Checkbox, Label, Selector, Steps, Textarea } from 'components';
import { Amount, Setup } from 'components/Listing';
import { UIList } from 'components/Listing/Listing.types';
import PaymentMethod from 'components/Listing/PaymentMethod';
import { useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

const SETUP_STEP = 1;
const AMOUNT_STEP = 2;
const PAYMENT_METHOD_STEP = 3;
const DETAILS_STEP = 4;
const DONE_STEP = 5;

const SellPage = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [list, setList] = useState<UIList>({ step: SETUP_STEP } as UIList);
  const step = list.step;

  if (!address || !chain || chain.unsupported) {
    return <p>Connect to Polygon</p>;
  }

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mb-16">
        <h1 className="text-2xl font-semibold text-gray-900">Crypto Listing</h1>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Steps
          currentStep={step}
          onStepClick={(n) => setList({ ...list, ...{ step: n } })}
        />
        {step === SETUP_STEP && <Setup list={list} updateList={setList} />}
        {step === AMOUNT_STEP && <Amount list={list} updateList={setList} />}
        {step === PAYMENT_METHOD_STEP && (
          <PaymentMethod list={list} updateList={setList} />
        )}
        {step === DETAILS_STEP && (
          <div className="my-8">
            <Label title="Time Limit for Payment" />
            <Selector
              value={10}
              suffix=" mins"
              updateValue={() => console.log('update')}
            />
            <Textarea label="Order Terms" rows={4} name="OrderTerms" />

            <Label title="Order Approval" />
            <div className="flex flex-col content-center rounded-lg bg-white p-4">
              <Checkbox content="Manual" id="manual" name="OrderApproval" />
              <Checkbox content="Automatic" id="automatic" name="OrderApproval" />
            </div>
          </div>
        )}
        {step === DONE_STEP && (
          <div className="p-8">Crypto Listing completed your next step is...</div>
        )}
      </div>
    </div>
  );
};

export default SellPage;
