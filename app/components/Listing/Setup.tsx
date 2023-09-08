import { getAuthToken } from '@dynamic-labs/sdk-react';
import { CurrencySelect, TokenSelect } from 'components';
import { Option } from 'components/Select/Select.types';
import { useFormErrors } from 'hooks';
import { Errors } from 'models/errors';
import { Token, User } from 'models/types';
import React, { useEffect, useState } from 'react';
import { Chain, useAccount, useNetwork } from 'wagmi';

import NetworkSelect from 'components/Select/NetworkSelect';
import { allChains } from 'models/networks';
import AccountInfo from './AccountInfo';
import { SetupListStepProps } from './Listing.types';
import ListType from './ListType';
import StepLayout from './StepLayout';

const Setup = ({ list, updateList, tokenId, currencyId }: SetupListStepProps) => {
	const { address } = useAccount();
	const { chain: connectedChain } = useNetwork();
	const { token, currency, type, chainId } = list;
	const [user, setUser] = useState<User | null>();
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
				chainId: chain?.id || list.chainId
			}
		});
	}, [lastToken, lastCurrency, chain]);

	useEffect(() => {
		if (!address) return;

		fetch(`/api/users/${address}`, {
			headers: {
				Authorization: `Bearer ${getAuthToken()}`
			}
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.errors) {
					setUser(null);
				} else {
					setUser(data);
				}
			});
	}, [address]);

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

	if (!user?.email) {
		return <AccountInfo setUser={setUser} />;
	}

	if (!list.type) {
		return <ListType list={list} updateList={updateList} />;
	}

	return (
		<StepLayout onProceed={onProceed}>
			<TokenSelect
				onSelect={updateToken}
				selected={token}
				error={errors.token}
				selectedIdOnLoad={tokenId as string}
				label={type === 'BuyList' ? 'Choose token to receive' : undefined}
				networkId={chain?.id}
			/>
			<CurrencySelect
				onSelect={updateCurrency}
				selected={currency}
				error={errors.currency}
				selectedIdOnLoad={currencyId as string}
				label={type === 'BuyList' ? 'Choose Fiat currency to pay with' : undefined}
			/>
			<NetworkSelect
				selected={chain}
				onSelect={setChain}
				label={`Select the chain you want to ${type === 'BuyList' ? 'receive' : 'sell'} funds on`}
			/>
		</StepLayout>
	);
};

export default Setup;
