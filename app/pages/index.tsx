import { Button, CurrencySelect, Input, ListsTable, TokenSelect } from 'components';
import debounce from 'lodash.debounce';
import { FiatCurrency, List, Token } from 'models/types';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { truncate } from 'utils';
import { useNetwork } from 'wagmi';
import { polygon } from 'wagmi/chains';

import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

const Quick = () => {
	const [fiatAmount, setFiatAmount] = useState<number>();
	const [tokenAmount, setTokenAmount] = useState<number>();
	const [currency, setCurrency] = useState<FiatCurrency>();
	const [token, setToken] = useState<Token>();
	const [lists, setLists] = useState<List[]>([]);
	const [loading, setLoading] = useState(false);
	const [seeLists, setSeeLists] = useState(false);

	const { chain, chains } = useNetwork();
	const chainId = chain?.id || chains[0]?.id || polygon.id;

	const search = async ({
		tokenValue,
		fiatValue
	}: {
		tokenValue: number | undefined;
		fiatValue: number | undefined;
	}) => {
		if (!chainId || !token || !currency || (!tokenValue && !fiatValue)) return;
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
			setLists(lists);
			const [list] = lists;
			const { price, id } = list || {};
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
		setLoading(false);
	};

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

	useEffect(() => {
		search({ fiatValue: fiatAmount, tokenValue: undefined });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currency]);

	useEffect(() => {
		search({ fiatValue: undefined, tokenValue: tokenAmount });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token]);

	useEffect(() => {
		if (token) {
			setToken(undefined);
			setLists([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chainId]);

	if (lists.length > 0 && seeLists) {
		return (
			<div className="py-6">
				<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
					<div className="flex">
						<div className="flex flex-row items-center cursor-pointer" onClick={() => setSeeLists(false)}>
							<ArrowLongLeftIcon width={24} />
							<span className="pl-2">Buy</span>
						</div>
					</div>
					<div className="py-4">
						<ListsTable lists={lists} />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col justify-center sm:py-12 sm:px-6 lg:px-8">
			<div className="mt-8 mx-4 sm:mx-auto sm:w-full sm:max-w-md ">
				<div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
					<div className="space-y-6">
						<div>
							<h1 className="text-lg">Buy</h1>
						</div>
						<div>
							<Input
								label="Fiat Amount"
								id="fiat"
								placeholder="Enter Amount"
								style="h-16"
								addOn={<CurrencySelect onSelect={setCurrency} selected={currency} minimal />}
								type="decimal"
								onChangeNumber={debounce(onChangeFiat, 1000)}
								value={fiatAmount}
							/>
						</div>
						<hr />
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
						{lists.length > 0 && (
							<div>
								<span>
									{lists.length} {lists.length > 1 ? 'options' : 'option'} available from{' '}
									{currency?.symbol} {lists[0].price} per {token?.symbol}
								</span>
							</div>
						)}

						<Button
							title="See Buy Options"
							processing={loading}
							disabled={!(currency && token && fiatAmount && tokenAmount && !loading)}
							onClick={() => setSeeLists(true)}
						/>
						<div className="text-center">
							<span className="text-xs text-gray-600 text-center">Always zero fees 🎉</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	return {
		props: {
			disableAuthentication: true,
			blankLayout: true
		}
	};
};

export default Quick;
