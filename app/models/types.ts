export interface FiatCurrency {
	id: number;
	code: string;
	name: string;
	icon: string;
	country_code: string;
	symbol: string;
}

export interface User {
	id: number;
	address: `0x${string}`;
}

export interface Token {
	id: number;
	address: string;
	decimals: number;
	symbol: string;
	name: string;
	coingecko_id?: string;
	icon: string;
}

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
	payment_method: PaymentMethod;
	total_available_amount: string;
}

export interface Bank {
	id: number;
	name: string;
	icon: string;
}

export interface PaymentMethod {
	id: number;
	account_name: string;
	account_number: string;
	details: string;
	user: User;
	bank: Bank;
	bank_id: number;
}

export interface Escrow {
	id: number;
	order_id: number;
	tx: `0x${string}`;
	address: `0x${string}`;
}

export interface Order {
	id: number;
	fiat_amount: number;
	token_amount: number;
	price: number;
	list: List;
	buyer: User;
	status: 'created' | 'escrowed' | 'release' | 'cancelled' | 'dispute' | 'closed';
	tx_hash: string | null | undefined;
	uuid: string;
	escrow: Escrow;
}
