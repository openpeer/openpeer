import { useEffect, useState } from 'react';

import { Token } from '../../models/types';
import Select from './Select';

const TokenSelect = () => {
  const [tokens, setTokens] = useState<Token[]>();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/tokens')
      .then((res) => res.json())
      .then((data) => {
        setTokens(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return tokens ? <Select label="Choose token to list" options={tokens} /> : <></>;
};
export default TokenSelect;
