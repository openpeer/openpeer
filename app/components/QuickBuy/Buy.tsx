import { Button, CurrencySelect, Input, TokenSelect } from 'components';
import debounce from 'lodash.debounce';
import { FiatCurrency, List, Token } from 'models/types';
import { useEffect, useState } from 'react';
import { truncate } from 'utils';
import { useNetwork } from 'wagmi';
import { polygon } from 'wagmi/chains';

import { CheckIcon } from '@heroicons/react/24/outline';

interface BuyProps {
	lists: List[];
	updateLists: (lists: List[]) => void;
	onSeeOptions: (fiatAmount: number, tokenAmount: number) => void;
	onLoading: (loading: boolean) => void;
}

const Buy = ({ lists, updateLists, onSeeOptions, onLoading }: BuyProps) => {
	const [fiatAmount, setFiatAmount] = useState<number>();
	const [tokenAmount, setTokenAmount] = useState<number>();
	const [currency, setCurrency] = useState<FiatCurrency>();
	const [token, setToken] = useState<Token>();
	const [loading, setLoading] = useState(false);

	const { chain, chains } = useNetwork();
	const chainId = chain?.id || chains[0]?.id || polygon.id;

	const updateLoading = (l: boolean) => {
		setLoading(l);
		onLoading(l);
	};

	useEffect(() => {
		if (token) {
			setToken(undefined);
			updateLists([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chainId]);

	const search = async ({
		tokenValue,
		fiatValue
	}: {
		tokenValue: number | undefined;
		fiatValue: number | undefined;
	}) => {
		if (!chainId || !token || !currency || (!tokenValue && !fiatValue)) return;
		updateLoading(true);
		try {
			const params = {
				chain_id: String(chainId),
				fiat_currency_code: currency.code,
				token_address: token.address,
				token_amount: String(tokenValue || ''),
				fiat_amount: String(fiatValue || '')
			};

			const filteredParams = Object.fromEntries(
				Object.entries(params).filter(([_, value]) => value !== undefined)
			);
			const response = await fetch(`/api/quickbuy?${new URLSearchParams(filteredParams).toString()}`);
			const lists: List[] = await response.json();
			updateLists(lists);

			const [list] = lists;
			const { price } = list || {};
			if (price) {
				if (tokenValue) setFiatAmount(tokenValue * price);
				if (fiatValue) setTokenAmount(truncate(fiatValue / price, token.decimals));
			} else {
				// @ts-ignore
				if (fiatValue) setTokenAmount('');
				// @ts-ignore
				if (tokenValue) setFiatAmount('');
			}
		} catch (error) {
			console.error(error);
		}
		updateLoading(false);
	};

	useEffect(() => {
		search({ fiatValue: fiatAmount, tokenValue: undefined });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currency]);

	useEffect(() => {
		search({ fiatValue: undefined, tokenValue: tokenAmount });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	const onChangeFiat = (val: number | undefined) => {
		setFiatAmount(val);
		if (val && token && currency) {
			search({ fiatValue: val, tokenValue: undefined });
		}
	};

	const onChangeToken = (val: number | undefined) => {
		setTokenAmount(val);
		if (val && token && currency) {
			search({ fiatValue: undefined, tokenValue: val });
		}
	};

	const onButtonClick = () => {
		if (!!fiatAmount && !!tokenAmount && !!currency && !!token) {
			onSeeOptions(fiatAmount, tokenAmount);
		}
	};

	return (
		<>
			<div>
				<Input
					label="Fiat Amount"
					id="fiat"
					placeholder="Enter Amount"
					style="h-16"
					addOn={<CurrencySelect onSelect={setCurrency} selected={currency} minimal selectTheFirst />}
					type="decimal"
					onChangeNumber={debounce(onChangeFiat, 1000)}
					value={fiatAmount}
				/>
			</div>
			<div>
				<Input
					label="Crypto to Receive"
					id="crypto"
					placeholder="Enter Amount"
					style="h-16"
					addOn={<TokenSelect onSelect={setToken} selected={token} minimal />}
					type="decimal"
					decimalScale={token?.decimals}
					onChangeNumber={debounce(onChangeToken, 1000)}
					value={tokenAmount}
				/>
			</div>
			{lists.length > 0 ? (
				<div className="mb-2 flex flex-row items-center">
					<CheckIcon width={20} height={20} className="text-green-500 stroke-2 mr-1" />
					<span className="text-sm text-gray-700">
						{lists.length} {lists.length > 1 ? 'options' : 'option'} available from {currency?.symbol}{' '}
						{Number(lists[0].price).toFixed(2)} per {token?.symbol}
					</span>
				</div>
			) : (
				!!token &&
				!!currency &&
				(!!fiatAmount || !!tokenAmount) &&
				!loading && (
					<div className="mb-2 text-sm text-gray-700">
						<span>We could not find ads for these settings</span>
					</div>
				)
			)}

			<Button
				title="See Buy Options"
				processing={loading}
				disabled={!(currency && token && fiatAmount && tokenAmount && !loading)}
				onClick={onButtonClick}
			/>
			<div className="text-center mt-4">
				<span className="text-xs text-gray-600 text-center">Always zero fees 🎉</span>
			</div>
		</>
	);
};

export default Buy;