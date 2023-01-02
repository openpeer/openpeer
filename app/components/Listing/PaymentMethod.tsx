import { BankSelect, Button, Input, Loading } from 'components';
import { PaymentMethod } from 'models/types';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import { PencilSquareIcon } from '@heroicons/react/20/solid';

import { StepProps, UIPaymentMethod } from './Listing.types';
import StepLayout from './StepLayout';

const PaymentMethod = ({ list, updateList }: StepProps) => {
  const { address } = useAccount();
  const { currency, paymentMethod = {} as PaymentMethod } = list;
  const {
    id,
    account_name: accountName,
    account_number: accountNumber,
    bank
  } = paymentMethod;

  const onProceed = () => {
    if (address && accountName && accountNumber && bank?.id) {
      updateList({ ...list, ...{ step: list.step + 1 } });
    }
  };

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>();
  const [isLoading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const setPaymentMethod = (pm: UIPaymentMethod | undefined) => {
    setEdit(false);
    updateList({ ...list, ...{ paymentMethod: pm } });
  };

  const updatePaymentMethod = (pm: UIPaymentMethod | undefined) => {
    updateList({ ...list, ...{ paymentMethod: pm } });
  };

  const enableEdit = (e: React.MouseEvent<HTMLElement>, pm: UIPaymentMethod) => {
    e.stopPropagation();
    updatePaymentMethod(pm);
    setEdit(true);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`/api/payment-methods?address=${address}`)
      .then((res) => res.json())
      .then((data) => {
        setPaymentMethods(data);
        if (!paymentMethod.id) setPaymentMethod(data[0]);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <StepLayout onProceed={onProceed}>
      <h2 className="text-xl mt-8">Payment Method</h2>
      <p>Choose how you want to receive your money</p>
      {(paymentMethods || []).map((pm) => (
        <div
          key={pm.id}
          className="w-full flex flex-col bg-gray-100 mt-8 py-4 p-8 border-2 border-slate-200 rounded-md"
          onClick={() => setPaymentMethod(pm)}
        >
          <div className="w-full flex flex-row justify-between mb-4">
            <div>Bank Transfer</div>
            <div onClick={(e) => enableEdit(e, pm)}>
              <PencilSquareIcon className="h-5 w-" aria-hidden="true" />
            </div>
          </div>
          <div className="mb-4">
            <div>{pm.account_name}</div>
            <div></div>
          </div>
          <div className="w-full flex flex-row justify-between">
            <div>{pm.account_number}</div>
            <div>{pm.bank?.name}</div>
          </div>
        </div>
      ))}

      {!id || edit ? (
        <>
          <Input
            label="Account Name"
            type="text"
            id="accountName"
            placeholder="Josh Adam"
            value={accountName}
            onChange={(n) =>
              updatePaymentMethod({
                ...paymentMethod,
                ...{ account_name: n }
              })
            }
          />
          <Input
            label="Account Number"
            id="accountNumber"
            placeholder="123456789"
            value={accountNumber}
            onChange={(n) =>
              updatePaymentMethod({
                ...paymentMethod,
                ...{ account_number: n }
              })
            }
          />
          <BankSelect
            currencyId={currency!.id}
            onSelect={(b) =>
              updatePaymentMethod({
                ...paymentMethod,
                ...{ bank: b }
              })
            }
            selected={bank}
          />
        </>
      ) : (
        <div>
          <Button
            title="Add New Payment Method +"
            outlined
            onClick={() => updatePaymentMethod(undefined)}
          />
        </div>
      )}
    </StepLayout>
  );
};

export default PaymentMethod;
