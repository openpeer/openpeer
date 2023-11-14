/* eslint-disable no-promise-executor-return */
import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import Loading from 'components/Loading/Loading';
import CurrencySelect from 'components/Select/CurrencySelect';
import TokenSelect from 'components/Select/TokenSelect';
import { useEscrowFee } from 'hooks';
import debounce from 'lodash.debounce';
import { FiatCurrency, List, Token } from 'models/types';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

import { CheckIcon } from '@heroicons/react/24/outline';
import { getAuthToken } from '@dynamic-labs/sdk-react';
import { formatUnits } from 'viem';

interface SellProps {
	lists: List[];
	updateLists: (lists: List[]) => void;
	onSeeOptions: (fiatAmount: number | undefined, tokenAmount: number) => void;
	onLoading: (loading: boolean) => void;
}

const Sell = ({ lists, updateLists, onSeeOptions, onLoading }: SellProps) => {
	const [tokenAmount, setTokenAmount] = useState<number>();
	const [currency, setCurrency] = useState<FiatCurrency>();
	const [token, setToken] = useState<Token>();
	const [creatingAd, setCreatingAd] = useState(false);
	const [loading, setLoading] = useState(false);

	const { fee } = useEscrowFee({ token, tokenAmount, chainId: token?.chain_id });

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
				type: 'BuyList',
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
		} catch (error) {
			console.error(error);
		}
		updateLoading(false);
	};

	const onChangeToken = (val: number | undefined) => {
		setTokenAmount(val);
		if (val && token && currency) {
			search({ fiatValue: undefined, tokenValue: val });
		}
	};

	useEffect(() => {
		search({ fiatValue: undefined, tokenValue: tokenAmount });
	}, [token, currency]);

	const presentSearchParams = currency && token && tokenAmount;
	const disabled = loading || !presentSearchParams;

	const onPostAd = async () => {
		if (disabled) return;

		if (lists.length === 0) {
			setCreatingAd(true);
			await new Promise((resolve) => setTimeout(resolve, 1500));
			router.push(
				{
					pathname: '/sell',
					query: { currency: currency.id, token: token.id, tokenAmount }
				},
				'/sell'
			);
		} else {
			onSeeOptions(undefined, tokenAmount);
		}
	};

	return (
		<>
			<div className={`${creatingAd ? 'hidden' : ''}`}>
				<div>
					<Input
						label="Crypto to Sell"
						id="cryptoSell"
						placeholder="Enter Amount"
						extraStyle="h-16"
						addOn={<TokenSelect onSelect={setToken} selected={token} minimal allTokens />}
						type="decimal"
						decimalScale={token?.decimals}
						onChangeNumber={debounce(onChangeToken, 1000)}
						value={tokenAmount}
					/>
				</div>
				<CurrencySelect
					onSelect={setCurrency}
					selected={currency}
					label="Fiat to Receive"
					height="h-16"
					selectByLocation
					selectTheFirst
				/>
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
					!!tokenAmount &&
					!loading && (
						<div className="mb-2 text-sm text-gray-700">
							<span>We could not find any available buyers. Post a sell ad instead.</span>
						</div>
					)
				)}

				<Button
					disabled={disabled}
					onClick={onPostAd}
					title={!presentSearchParams || lists.length > 0 ? 'See Sell Options' : 'Post a Sell Ad'}
				/>

				<div className="text-center mt-4">
					{!!fee && !!token && (
						<span className="text-xs text-gray-600 text-center">
							Total fee: {formatUnits(fee, token.decimals)} {token.symbol}
						</span>
					)}
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

export default Sell;
