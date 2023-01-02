import { Steps } from 'components';
import { Amount, Details, PaymentMethod, Setup, Summary } from 'components/Listing';
import { UIList } from 'components/Listing/Listing.types';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

import { ConnectButton } from '@rainbow-me/rainbowkit';

const SETUP_STEP = 1;
const AMOUNT_STEP = 2;
const PAYMENT_METHOD_STEP = 3;
const DETAILS_STEP = 4;
const DONE_STEP = 5;

const SellPage = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [list, setList] = useState<UIList>({
    step: SETUP_STEP,
    marginType: 'fixed'
  } as UIList);
  const step = list.step;

  useEffect(() => {
    if (list.step > 3)
      setList({ step: PAYMENT_METHOD_STEP, marginType: 'fixed' } as UIList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, chain]);

  if (!address || !chain || chain.unsupported) {
    return (
      <div className="flex h-screen">
        <div className="m-auto flex flex-col justify-items-center content-center text-center">
          <span className="mb-6 text-xl">Connect to Polygon</span>{' '}
          <span className="mb-6 text-gray-500 text-xl">
            Access the OpenPeer using your favorite wallet
          </span>
          <span className="mb-4 m-auto">
            <ConnectButton showBalance={false} />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mb-16">
        <h1 className="text-2xl font-semibold text-gray-900">
          Crypto Listing » Sell Order
        </h1>
      </div>
      <div className="w-full flex flex-row px-4 sm:px-6 md:px-8 mb-16">
        <div className="w-full lg:w-2/4">
          <Steps
            currentStep={step}
            onStepClick={(n) => setList({ ...list, ...{ step: n } })}
          />
          {step === SETUP_STEP && <Setup list={list} updateList={setList} />}
          {step === AMOUNT_STEP && <Amount list={list} updateList={setList} />}
          {step === PAYMENT_METHOD_STEP && (
            <PaymentMethod list={list} updateList={setList} />
          )}
          {step === DETAILS_STEP && <Details list={list} updateList={setList} />}
          {step === DONE_STEP && (
            <div className="flex h-screen">
              <div className="m-auto flex flex-col justify-items-center content-center text-center">
                <span className="text-xl">Crypto Listing completed.</span>
              </div>
            </div>
          )}
        </div>
        <Summary list={list} />
      </div>
    </div>
  );
};

export default SellPage;
