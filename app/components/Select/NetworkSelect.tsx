import React from 'react';
import { Chain, useNetwork } from 'wagmi';

import { arbitrum, optimism } from 'wagmi/chains';
import Select from './Select';
import { SelectProps } from './Select.types';

const NetworkSelect = ({
	onSelect,
	selected,
	error,
	labelStyle = ''
}: {
	onSelect: (option: Chain | undefined) => void;
	selected: Chain | undefined;
	error?: SelectProps['error'];
	labelStyle?: SelectProps['labelStyle'];
}) => {
	const { chains } = useNetwork();

	const replace: { [key: number]: { symbol: string; icon: string } } = {
		[arbitrum.id]: { symbol: 'ARB', icon: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=026' },
		[optimism.id]: {
			symbol: 'OPTMISM',
			icon: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png?v=026'
		}
	};
	const networks = chains.map((chain) => ({
		id: chain.id,
		name: chain.name,
		symbol: replace[chain.id]?.symbol || chain.nativeCurrency.symbol,
		icon: replace[chain.id]?.icon
	}));

	return (
		<Select
			label="Chain"
			options={networks}
			selected={selected as SelectProps['selected']}
			onSelect={onSelect as SelectProps['onSelect']}
			error={error}
			labelStyle={labelStyle}
			token
		/>
	);
};

export default NetworkSelect;
