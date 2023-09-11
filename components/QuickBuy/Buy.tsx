/* eslint-disable no-promise-executor-return */
import { Button, CurrencySelect, Input, Loading, TokenSelect } from 'components';
import debounce from 'lodash.debounce';
import { FiatCurrency, List, Token } from 'models/types';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { truncate } from 'utils';

import { CheckIcon } from '@heroicons/react/24/outline';
import { getAuthToken } from '@dynamic-labs/sdk-react';

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
	const [creatingAd, setCreatingAd] = useState(false);
	const router = useRouter();

	const updateLoading = (l: boolean) => {
		setLoading(l);
		onLoading(l);
	};

	const search = async ({
		tokenValue,
		fiatValue
	}: {
		tokenValue: number | undefined;
		fiatValue: number | undefined;
	}) => {
		if (!token || !currency || (!tokenValue && !fiatValue)) return;
		updateLoading(true);
		try {
			const params = {
				type: 'SellList',
				fiat_currency_code: currency.code,
				token_symbol: token.symbol,
				token_amount: String(tokenValue || ''),
				fiat_amount: String(fiatValue || '')
			};

			const filteredParams = Object.fromEntries(
				Object.entries(params).filter(([, value]) => value !== undefined)
			);
			const response = await fetch(`/api/quickbuy?${new URLSearchParams(filteredParams).toString()}`, {
				headers: {
					Authorization: `Bearer ${getAuthToken()}`
				}
			});
			const searchLists: List[] = await response.json();
			updateLists(searchLists);

			const [list] = searchLists;
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
	}, [currency]);

	useEffect(() => {
		search({ fiatValue: undefined, tokenValue: tokenAmount });
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

	const presentSearchParams = currency && token && (fiatAmount || tokenAmount);
	const disabled = loading || !presentSearchParams;

	const onButtonClick = async () => {
		if (disabled) return;

		if (!!fiatAmount && !!tokenAmount && !!currency && !!token) {
			onSeeOptions(fiatAmount, tokenAmount);
		} else if (presentSearchParams && lists.length === 0) {
			setCreatingAd(true);
			await new Promise((resolve) => setTimeout(resolve, 1500));
			router.push(
				{
					pathname: '/sell',
					query: { currency: currency.id, token: token.id, fiatAmount, tokenAmount }
				},
				'/sell'
			);
		}
	};

	return (
		<>
			<div className={`${creatingAd ? 'hidden' : ''}`}>
				<div>
					<Input
						label="Fiat Amount"
						id="fiat"
						placeholder="Enter Amount"
						extraStyle="h-16"
						addOn={
							<CurrencySelect
								onSelect={setCurrency}
								selected={currency}
								minimal
								selectTheFirst
								selectByLocation
							/>
						}
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
						extraStyle="h-16"
						addOn={<TokenSelect onSelect={setToken} selected={token} minimal allTokens />}
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
							<span>We could not find any available sellers. Post a buy ad instead.</span>
						</div>
					)
				)}

				<Button
					title={!presentSearchParams || lists.length > 0 ? 'See Buy Options' : 'Post a Buy Ad'}
					processing={loading}
					disabled={disabled}
					onClick={onButtonClick}
				/>
				<div className="text-center mt-4">
					<span className="text-xs text-gray-600 text-center">Always zero fees 🎉</span>
				</div>
			</div>
			<div className={`${!creatingAd ? 'hidden' : ''}`}>
				<div className="">
					<Loading message="We are redirecting you to your ad 🚀" big={false} row={false} />
				</div>
			</div>
		</>
	);
};

export default Buy;
