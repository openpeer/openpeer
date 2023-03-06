import { Loading } from 'components';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

import { Token } from 'models/types';
import Select from './Select';
import { SelectProps } from './Select.types';

const TokenSelect = ({
	onSelect,
	selected,
	error,
	minimal
}: {
	onSelect: (option: Token | undefined) => void;
	selected: SelectProps['selected'];
	error?: SelectProps['error'];
	minimal?: SelectProps['minimal'];
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
				onSelect(undefined);
				setTokens(data);
				setLoading(false);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chainId]);

	if (isLoading) {
		return <Loading />;
	}
	return tokens ? (
		<Select
			label="Choose token to list"
			options={tokens}
			selected={selected}
			onSelect={onSelect as SelectProps['onSelect']}
			error={error}
			minimal={minimal}
		/>
	) : (
		<></>
	);
};
export default TokenSelect;
