import { useEffect, useState } from 'react';

import { FiatCurrency } from '../../models/types';
import Select from './Select';

const CurrencySelect = () => {
  const [currencies, setCurrencies] = useState<FiatCurrency[]>();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/currencies')
      .then((res) => res.json())
      .then((data) => {
        setCurrencies(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return currencies ? (
    <Select label="Choose Fiat currency to receive" options={currencies} />
  ) : (
    <></>
  );
};
export default CurrencySelect;
