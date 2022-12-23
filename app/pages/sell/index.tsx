import { useState } from 'react';

import { PencilSquareIcon } from '@heroicons/react/24/outline';

import Button from '../../components/Button/Button';
import ButtonOutlined from '../../components/Button/ButtonOutlined';
import Input from '../../components/Input/Input';
import InputAddOns from '../../components/Input/InputAddOns';
import Label from '../../components/Label/Label';
import BankSelect from '../../components/Select/BankSelect';
import CurrencySelect from '../../components/Select/CurrencySelect';
import TokenSelect from '../../components/Select/TokenSelect';
import Steps from '../../components/Steps';
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
            <div>
              <Label title="Set Price Margin" />
              <div
                className="flex space-x-1 rounded-lg bg-slate-100 p-0.5"
                role="tablist"
                aria-orientation="horizontal"
              >
                <button
                  className="flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3 bg-white shadow"
                  id="headlessui-tabs-tab-284"
                  role="tab"
                  type="button"
                  aria-selected="true"
                  data-headlessui-state="selected"
                  aria-controls="headlessui-tabs-panel-286"
                >
                  <span className="lg:ml-2 text-slate-900">Fixed</span>
                </button>
                <button
                  className="flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3"
                  id="headlessui-tabs-tab-285"
                  role="tab"
                  type="button"
                  aria-selected="false"
                  data-headlessui-state=""
                  aria-controls="headlessui-tabs-panel-287"
                >
                  <span className="lg:ml-2 text-slate-600">Percentage</span>
                </button>
              </div>
            </div>
            <div className="flex flex-row justify-between content-center bg-gray-100 my-8 py-4 p-8 border-2 border-slate-200 rounded-md">
              <div className="text-xl font-bold">-</div>
              <div className="flex flex-col item-center">
                <div className="text-xl font-bold">20 INR</div>
                <div className="text-sm">Spot Price</div>
              </div>
              <div className="text-xl font-bold">+</div>
            </div>
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
              <ButtonOutlined title="Add New Payment Method +" />
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <div className="my-8">
              <Label title="Time Limit for Payment" />
              <div className="flex flex-row justify-between content-center bg-gray-100 mt-1 mb-8 py-4 p-8 border-2 border-slate-200 rounded-md">
                <div className="text-xl font-bold">-</div>
                <div className="flex flex-col item-center">
                  <div className="text-xl font-bold">10 mins</div>
                </div>
                <div className="text-xl font-bold">+</div>
              </div>

              <Textarea
                label="Order Terms"
                rows="4"
                name="OrderTerms"
                id={''}
                placeholder={''}
              />
            </div>
          </>
        )}
        <Button title="Proceed" onClick={proceed} />
      </div>
    </div>
  );
};

export default SellPage;
