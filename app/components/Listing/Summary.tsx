import Image from 'next/image';

import { UIList } from './Listing.types';

interface SummaryProps {
  list: UIList;
}

const Summary = ({ list }: SummaryProps) => {
  const {
    token,
    currency,
    totalAvailableAmount,
    limitMin,
    limitMax,
    marginType,
    margin,
    paymentMethod,
    terms
  } = list;
  //@ts-ignore
  const currencySymbol = currency?.symbol;

  if (!token && !currency) {
    return <></>;
  }

  return (
    <div className="w-2/4 hidden md:inline-block bg-white rounded-xl border-2 border-slate-100 overflow-hidden shadow-sm md:ml-16 md:px-8 md:py-6 p-4">
      <ul className="w-full">
        {!!token && (
          <li className="w-full flex flex-row justify-between mb-4">
            <div>Token</div>
            <div>
              <div className="flex flex-row">
                <span>
                  <Image
                    src={token.icon}
                    alt={token.name}
                    className="h-6 w-6 flex-shrink-0 rounded-full "
                    width={24}
                    height={24}
                  />
                </span>
                <span className="font-bold"> {token.name}</span>
              </div>
            </div>
          </li>
        )}
        {!!currency && (
          <li className="w-full flex flex-row justify-between mb-4">
            <div>Fiat</div>
            <div>
              <div className="flex flex-row">
                <span>
                  <Image
                    src={currency.icon}
                    alt={currency.name}
                    className="h-6 w-6 flex-shrink-0 rounded-full "
                    width={24}
                    height={24}
                  />
                </span>
                <span className="font-bold"> {currency.name}</span>
              </div>
            </div>
          </li>
        )}
        {!!totalAvailableAmount && (
          <li className="w-full flex flex-row justify-between mb-4">
            <div>Total Available</div>
            <div className="font-bold">
              {totalAvailableAmount} {token?.name}
            </div>
          </li>
        )}
        {!!limitMin && (
          <li className="w-full flex flex-row justify-between mb-4">
            <div>Min Order</div>
            <div className="font-bold">
              {currencySymbol} {limitMin}
            </div>
          </li>
        )}
        {!!limitMax && (
          <li className="w-full flex flex-row justify-between mb-4">
            <div>Max Order</div>
            <div className="font-bold">
              {currencySymbol} {limitMax}
            </div>
          </li>
        )}
        {!!margin && (
          <li className="w-full flex flex-row justify-between mb-4 border-bottom border-dashed border-color-gray-200">
            <div>Your Price</div>
            <div className="font-bold">
              {marginType === 'fixed'
                ? `${currencySymbol} ${margin.toFixed(2)} per ${token?.name}`
                : `Spot price + ${margin.toFixed(2)}%`}
            </div>
          </li>
        )}
        <div className="mt-6 mb-6 border-b-2 border-dashed border-color-gray-400"></div>
        {!!paymentMethod && (
          <li className="w-full flex flex-row justify-between mb-4">
            <div>Payment Method</div>
            <div className="w-2/4 flex flex-col bg-[#F7FBFC] border-cyan-200 rounded p-4">
              <span className="text-gray-500 text-sm mb-2">Bank Transfer</span>
              <span className="mb-2">{paymentMethod.account_name}</span>
              <div className="flex flex-row justify-between">
                <span>{paymentMethod.account_number}</span>
                <span>{paymentMethod.bank?.name}</span>
              </div>
            </div>
          </li>
        )}
        {!!terms && (
          <li className="w-full flex flex-row justify-between mb-4">
            <div>Terms</div>
            <div className="font-bold">{terms}</div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Summary;
