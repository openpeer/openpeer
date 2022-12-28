import { Bank } from 'models/types';
import { useEffect, useState } from 'react';

import Select from './Select';
import { SelectProps } from './Select.types';

const BankSelect = ({
  currencyId,
  onSelect,
  selected
}: {
  currencyId: number;
  onSelect: SelectProps['onSelect'];
  selected: SelectProps['selected'];
}) => {
  const [banks, setBanks] = useState<Bank[]>();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/banks?currency_id=${currencyId}`)
      .then((res) => res.json())
      .then((data) => {
        setBanks(data);
        setLoading(false);
      });
  }, [currencyId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return banks ? (
    <Select label="Bank Name" options={banks} selected={selected} onSelect={onSelect} />
  ) : (
    <></>
  );
};
export default BankSelect;
