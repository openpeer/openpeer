import { allChains } from 'models/networks';
import React from 'react';
import { Chain } from 'wagmi';

import { arbitrum, gnosis, optimism } from 'wagmi/chains';
import Select from './Select';
import { SelectProps } from './Select.types';

const NetworkSelect = ({
	onSelect,
	selected,
	error,
	labelStyle = '',
	label = 'Chain',
	extraStyle = ''
}: {
	onSelect: (option: Chain | undefined) => void;
	selected: Chain | undefined;
	error?: SelectProps['error'];
	labelStyle?: SelectProps['labelStyle'];
	label?: string;
	extraStyle?: string;
}) => {
	const replace: { [key: number]: { symbol: string; icon: string } } = {
		[arbitrum.id]: { symbol: 'ARB', icon: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=026' },
		[optimism.id]: {
			symbol: 'OPTIMISM',
			icon: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png?v=026'
		},
		[gnosis.id]: { symbol: 'xDAI', icon: 'https://cryptologos.cc/logos/gnosis-gno-gno-logo.png?v=026' }
	};
	const networks = allChains.map((chain) => ({
		id: chain.id,
		name: chain.name,
		symbol: replace[chain.id]?.symbol || chain.nativeCurrency.symbol,
		icon: replace[chain.id]?.icon
	}));

	return (
		<Select
			label={label}
			options={networks}
			selected={selected as SelectProps['selected']}
			onSelect={onSelect as SelectProps['onSelect']}
			error={error}
			labelStyle={labelStyle}
			extraStyle={extraStyle}
			network
		/>
	);
};

export default NetworkSelect;
