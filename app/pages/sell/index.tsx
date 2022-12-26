import { useState } from 'react';

import { PencilSquareIcon } from '@heroicons/react/24/outline';

import Button from '../../components/Button/Button';
import Checkbox from '../../components/Checkbox/Checkbox';
import Input from '../../components/Input/Input';
import InputAddOns from '../../components/Input/InputAddOns';
import Label from '../../components/Label/Label';
import BankSelect from '../../components/Select/BankSelect';
import CurrencySelect from '../../components/Select/CurrencySelect';
import TokenSelect from '../../components/Select/TokenSelect';
import Selector from '../../components/Selector';
import Steps from '../../components/Steps';
import Switcher from '../../components/Switcher';
import Textarea from '../../components/Textarea/Textarea';

const SellPage = () => {
  const [step, setStep] = useState(1);
  const proceed = () => {
    setStep(step + 1);
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mb-16">
        <h1 className="text-2xl font-semibold text-gray-900">Crypto Listing</h1>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Steps currentStep={step} />
        {step === 1 && (
          <>
            <TokenSelect />
            <CurrencySelect />
          </>
        )}
        {step === 2 && (
          <>
            <InputAddOns
              label="Enter total available crypto amount"
              addOn="USDT"
              htmlFor="price"
              inputId="price"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter fiat order limit
              </label>
              <div className="flex flex-row gap-x-8">
                <InputAddOns
                  label="Min:"
                  addOn="INR"
                  htmlFor="minPrice"
                  inputId="minPrice"
                />
                <InputAddOns
                  label="Max:"
                  addOn="INR"
                  htmlFor="maxPrice"
                  inputId="maxPrice"
                />
              </div>
            </div>

            <Label title="Set Price Margin" />
            <Switcher />

            <div className="w-full flex flex-row justify-between mb-8">
              <div>
                <div>Lowest price</div>
                <div className="text-xl font-bold">25.9 INR</div>
              </div>
              <div>
                <div>Highest price</div>
                <div className="text-xl font-bold">25.9 INR</div>
              </div>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h2 className="text-xl mt-8">Payment Method</h2>
            <p>Choose how you want to receive your money</p>
            <Input
              label="Account Name"
              type="text"
              name="user_name"
              placeholder="Josh Adam"
            />
            <Input
              label="Account Number"
              type="tel"
              name="user_account_number"
              placeholder="1000"
            />
            <BankSelect />

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
          </>
        )}
        {step === 4 && (
          <>
            <div className="my-8">
              <Label title="Time Limit for Payment" />
              <Selector value="10 mins" underValue={''} />
              <Textarea
                label="Order Terms"
                rows="4"
                name="OrderTerms"
                id={''}
                placeholder={''}
              />

              <Label title="Order Approval" />
              <div className="flex flex-col content-center rounded-lg bg-white p-4">
                <Checkbox content="Manual" id={'manual'} name="OrderApproval" />
                <Checkbox content="Automatic" id={'automatic'} name="OrderApproval" />
              </div>
            </div>
          </>
        )}
        {step === 5 && (
          <>
            <div className="p-8">Crypto Listing compleated your nex step is...</div>{' '}
          </>
        )}
        <Button title="Proceed" onClick={proceed} />
      </div>
    </div>
  );
};

export default SellPage;
