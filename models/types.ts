import { CountriesType } from './countries';

export interface FiatCurrency {
	id: number;
	code: string;
	name: string;
	icon: string;
	country_code: CountriesType;
	symbol: string;
	allow_binance_rates: boolean;
	default_price_source: PriceSource;
}

export interface User {
	id: number;
	email: string;
	address: `0x${string}`;
	trades: number;
	image_url: string | null;
	name: string | null;
	twitter: string | null;
	completion_rate: number | null;
	created_at: string;
	verified: boolean;
	contracts: Contract[];
	timezone: string | null;
	available_from: number | null;
	available_to: number | null;
	weekend_offline: boolean;
	online: boolean | null;
}

export interface Token {
	id: number;
	address: `0x${string}`;
	decimals: number;
	chain_id: number;
	symbol: string;
	name: string;
	coingecko_id: string;
	icon: string;
	gasless: boolean;
	minimum_amount?: number;
	allow_binance_rates: boolean;
}

export type PriceSource = 'coingecko' | 'binance_median' | 'binance_min' | 'binance_max';

export interface List {
	id: number;
	automatic_approval: boolean;
	chain_id: number;
	fiat_currency: FiatCurrency;
	limit_min: number | null | undefined;
	limit_max: number | null | undefined;
	margin_type: 'fixed' | 'percentage';
	margin: number;
	seller: User;
	status: 'created' | 'active' | 'closed';
	terms: string | undefined | null;
	token: Token;
	payment_methods: PaymentMethod[];
	banks: Bank[];
	total_available_amount: string;
	price: number;
	type: 'SellList' | 'BuyList';
	deposit_time_limit: number | undefined;
	payment_time_limit: number | undefined;
	accept_only_verified: boolean;
	escrow_type: 'manual' | 'instant';
	contract: `0x${string}` | undefined;
	price_source: PriceSource;
}

export interface AccountField {
	type: 'text' | 'textarea' | 'message';
	id: string;
	label: string;
	placeholder: string;
	required: boolean;
}

export interface AccountFieldValue {
	[key: string]: string | undefined;
}

export interface Bank {
	id: number;
	name: string;
	icon: string;
	account_info_schema: AccountField[];
	color: string;
}

export interface PaymentMethod {
	id: number;
	bank: Bank;
	bank_id: number;
	values: AccountFieldValue;
}

export interface Escrow {
	id: number;
	order_id: number;
	tx: `0x${string}`;
	address: `0x${string}`;
	created_at: string;
}

export interface DisputeFile {
	id: number;
	upload_url: string;
	key: string;
	filename: string;
}

export interface UserDispute {
	id: number;
	comments: string;
	dispute_files: DisputeFile[];
}

export interface Dispute {
	id: number;
	resolved: boolean;
	winner: User | null;
	user_dispute: UserDispute;
	counterpart_replied: boolean;
}

export interface Order {
	id: number;
	fiat_amount: number;
	token_amount: number;
	price: number | undefined;
	list: List;
	seller: User;
	buyer: User;
	status: 'created' | 'escrowed' | 'release' | 'cancelled' | 'dispute' | 'closed';
	tx_hash: string | null | undefined;
	uuid: `0x${string}`;
	cancelled_at: string;
	escrow?: Escrow;
	dispute?: Dispute;
	created_at: string;
	payment_method: PaymentMethod;
	trade_id: string;
	deposit_time_limit: number | undefined;
	payment_time_limit: number;
	chain_id: number;
}

export interface Airdrop {
	buy_volume?: number;
	sell_volume?: number;
	total: number;
}

export interface Contract {
	id: number;
	address: `0x${string}`;
	chain_id: number;
	version: string;
}
