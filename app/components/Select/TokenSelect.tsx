import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

import { Token } from '../../models/types';
import Select from './Select';

const TokenSelect = () => {
  const [tokens, setTokens] = useState<Token[]>();
  const [isLoading, setLoading] = useState(false);
  const { chain, chains } = useNetwork();
  const chainId = chain?.id || chains[0]?.id;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/tokens?chain_id=${chainId}`)
      .then((res) => res.json())
      .then((data) => {
        setTokens(data);
        setLoading(false);
      });
  }, [chainId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return tokens ? <Select label="Choose token to list" options={tokens} /> : <></>;
};
export default TokenSelect;
