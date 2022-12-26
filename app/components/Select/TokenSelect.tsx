import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

import { Token } from '../../models/types';
import Select from './Select';
import { SelectProps } from './Select.types';

const TokenSelect = ({
  onSelect,
  selected
}: {
  onSelect: SelectProps['onSelect'];
  selected: SelectProps['selected'];
}) => {
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
  return tokens ? (
    <Select
      label="Choose token to list"
      options={tokens}
      selected={selected}
      onSelect={onSelect}
    />
  ) : (
    <></>
  );
};
export default TokenSelect;
