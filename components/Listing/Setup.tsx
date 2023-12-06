import { CurrencySelect, TokenSelect } from 'components';
import { Option } from 'components/Select/Select.types';
import { useFormErrors, useNetwork } from 'hooks';
import { Errors } from 'models/errors';
import { FiatCurrency, Token } from 'models/types';
import React, { useEffect, useState } from 'react';
import { Chain } from 'wagmi';

import NetworkSelect from 'components/Select/NetworkSelect';
import { allChains } from 'models/networks';
import { ListStepProps } from './Listing.types';
import StepLayout from './StepLayout';

const Setup = ({ list, updateList }: ListStepProps) => {
	const { chain: connectedChain } = useNetwork();
	const { token, currency, type, chainId } = list;
	const [lastToken, setLastToken] = useState<Option | undefined>(token);
	const [lastCurrency, setLastCurrency] = useState<Option | undefined>(currency);
	const { errors, clearErrors, validate } = useFormErrors();
	const [chain, setChain] = useState<Chain>();

	const updateToken = (t: Option | undefined) => {
		clearErrors(['token']);
		setLastToken(t);
	};

	const updateCurrency = (c: Option | undefined) => {
		clearErrors(['currency']);
		setLastCurrency(c);
	};

	useEffect(() => {
		if (!chain && !chainId && connectedChain) {
			setChain({
				...connectedChain,
				// @ts-expect-error
				symbol: connectedChain.nativeCurrency.symbol
			});
		}
	}, [connectedChain]);

	useEffect(() => {
		if (chainId && !chain) {
			const newChain = allChains.find((c) => c.id === chainId);
			setChain({
				...newChain,
				// @ts-expect-error
				symbol: newChain.nativeCurrency.symbol
			});
		}
	}, [chainId]);

	useEffect(() => {
		if (!chain) return;

		if (token && chain.id !== (token as Token).chain_id) {
			updateToken(undefined);
		}
	}, [chain]);

	useEffect(() => {
		updateList({
			...list,
			...{
				currency: lastCurrency,
				fiatCurrencyId: lastCurrency?.id,
				token: lastToken,
				tokenId: lastToken?.id,
				margin: list.marginType === 'fixed' ? undefined : list.margin,
				chainId: chain?.id || list.chainId,
				priceSource: (lastCurrency as FiatCurrency)?.default_price_source
			}
		});
	}, [lastToken, lastCurrency, chain]);

	const resolver = () => {
		const error: Errors = {};
		if (!token) {
			error.token = 'Should be present';
		}

		if (!currency) {
			error.currency = 'Should be present';
		}
		return error;
	};

	const onProceed = () => {
		if (validate(resolver)) {
			updateList({ ...list, ...{ step: list.step + 1 } });
		}
	};

	return (
		<StepLayout onProceed={onProceed}>
			<TokenSelect
				onSelect={updateToken}
				selected={token}
				error={errors.token}
				label={type === 'BuyList' ? 'Choose token to receive' : undefined}
				networkId={chain?.id}
			/>
			<CurrencySelect
				onSelect={updateCurrency}
				selected={currency}
				error={errors.currency}
				label={type === 'BuyList' ? 'Choose Fiat currency to pay with' : undefined}
			/>
			<div className="mb-8">
				<NetworkSelect
					selected={chain}
					onSelect={setChain}
					extraStyle="my-0 mt-4"
					label={`Select the chain you want to ${type === 'BuyList' ? 'receive' : 'sell'} funds on`}
				/>
			</div>
		</StepLayout>
	);
};

export default Setup;
