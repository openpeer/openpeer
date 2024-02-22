import { FiatCurrency, Token } from 'models/types';

export interface Option {
	id: number;
	name: string;
	icon?: string;
}

export interface SelectProps {
	label: string;
	options: Option[];
	selected: Option | undefined;
	onSelect: (option: Option | undefined) => void;
	error?: string;
	minimal?: boolean;
	height?: string;
	rounded?: boolean;
	flag?: boolean;
	token?: boolean;
	network?: boolean;
	onSearch?: (value: string) => void;
	labelStyle?: string;
	extraStyle?: string;
}

export interface FiatCurrencySelect {
	label?: string;
	onSelect: (option: FiatCurrency | undefined) => void;
	selected: SelectProps['selected'];
	error?: SelectProps['error'];
	minimal?: SelectProps['minimal'];
	height?: SelectProps['height'];
	selectedIdOnLoad?: string;
	selectTheFirst?: boolean;
	selectByLocation?: boolean;
	labelStyle?: string;
}

export interface TokenSelectProps {
	onSelect: (option: Token | undefined) => void;
	selected: SelectProps['selected'];
	error?: SelectProps['error'];
	minimal?: SelectProps['minimal'];
	selectedIdOnLoad?: string;
	label?: string;
	labelStyle?: string;
	networkId?: number;
	allTokens?: boolean;
}

export type TimezoneSelectProps = Pick<SelectProps, 'selected' | 'onSelect' | 'error'>;
