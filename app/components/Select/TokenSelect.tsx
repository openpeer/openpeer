import Loading from 'components/Loading/Loading';
import { Token } from 'models/types';
import React, { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';
import { polygon } from 'wagmi/chains';

import Select from './Select';
import { SelectProps, TokenSelectProps } from './Select.types';

const TokenSelect = ({
	onSelect,
	selected,
	error,
	minimal,
	selectedIdOnLoad,
	label = 'Choose token to list'
}: TokenSelectProps) => {
	const [tokens, setTokens] = useState<Token[]>();
	const [isLoading, setLoading] = useState(false);
	const { chain, chains } = useNetwork();
	const chainId = chain?.id || chains[0]?.id || polygon.id;

	useEffect(() => {
		if (!chainId) return;

		setLoading(true);
		fetch(`/api/tokens?chain_id=${chainId}`)
			.then((res) => res.json())
			.then((data) => {
				const source: Token[] = minimal ? data.map((t: Token) => ({ ...t, ...{ name: t.symbol } })) : data;
				setTokens(source);
				if (selectedIdOnLoad) {
					if (!selected) {
						const toSelect = source.find(({ id }) => String(id) === selectedIdOnLoad);
						if (toSelect && !selected) {
							onSelect(toSelect);
						}
					}
				} else if (minimal && !selected && source[0]) {
					onSelect(source[0]);
				}
				setLoading(false);
			});
	}, [chainId]);

	if (isLoading) {
		return <Loading message="" />;
	}
	return tokens ? (
		<Select
			label={label}
			options={tokens}
			selected={selected}
			onSelect={onSelect as SelectProps['onSelect']}
			error={error}
			minimal={minimal}
			token
		/>
	) : (
		<></>
	);
};
export default TokenSelect;
