import { useState } from 'react';

import Button from '../../../components/Button/Button';
import CurrencySelect from '../../../components/Select/CurrencySelect';
import TokenSelect from '../../../components/Select/TokenSelect';
import Steps from '../../../components/Steps';

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
            <h1>2</h1>
          </>
        )}
        {step === 3 && (
          <>
            <h1>3</h1>
          </>
        )}
        {step === 4 && (
          <>
            <h1>4</h1>
          </>
        )}
        <Button title="Proceed" onClick={proceed} />
      </div>
    </div>
  );
};

export default SellPage;
