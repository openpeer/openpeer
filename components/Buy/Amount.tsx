/* eslint-disable react/jsx-curly-newline */
import { getAuthToken } from '@dynamic-labs/sdk-react';
import Flag from 'components/Flag/Flag';
import Input from 'components/Input/Input';
import { AccountInfo } from 'components/Listing';
import StepLayout from 'components/Listing/StepLayout';
import Token from 'components/Token/Token';
import { useFormErrors, useAccount, useEscrowFee } from 'hooks';
import { countries } from 'models/countries';
import { Errors, Resolver } from 'models/errors';
import { Bank, List, Order, User } from 'models/types';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { truncate } from 'utils';

import snakecaseKeys from 'snakecase-keys';
import { useContractRead } from 'wagmi';
import { OpenPeerDeployer, OpenPeerEscrow } from 'abis';
import { Abi, formatUnits, parseUnits } from 'viem';
import { DEPLOYER_CONTRACTS } from 'models/networks';
import BankSelect from 'components/Select/BankSelect';
import { BuyStepProps, UIOrder } from './Buy.types';

interface BuyAmountStepProps extends BuyStepProps {
	price: number | undefined;
}

const Prefix = ({ label, image }: { label: string; image: React.ReactNode }) => (
	<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
		<div className="flex flex-row">
			<span className="mr-2">{image}</span>
			<span className="text-gray-500">{label}</span>
		</div>
	</div>
);

const Amount = ({ order, updateOrder, price }: BuyAmountStepProps) => {
	const router = useRouter();
	const { list = {} as List, token_amount: orderTokenAmount, fiat_amount: orderFiatAmount } = order;
	const { address } = useAccount();
	const { fiat_currency: currency, token, accept_only_verified: acceptOnlyVerified } = list;

	const [fiatAmount, setFiatAmount] = useState<number | undefined>(orderFiatAmount || undefined);
	const [tokenAmount, setTokenAmount] = useState<number | undefined>(orderTokenAmount || undefined);
	const [user, setUser] = useState<User | null>();
	const [bank, setBank] = useState<Bank>();

	const { errors, clearErrors, validate } = useFormErrors();

	const banks = list.payment_methods.map((pm) => ({ ...pm.bank, id: pm.id }));
	const instantEscrow = list?.escrow_type === 'instant';

	const { data: sellerContract } = useContractRead({
		address: DEPLOYER_CONTRACTS[list.chain_id],
		abi: OpenPeerDeployer,
		functionName: 'sellerContracts',
		args: [list.seller.address],
		enabled: instantEscrow,
		watch: true,
		chainId: list.chain_id
	});

	const { data: balance } = useContractRead({
		address: (sellerContract as `0x${string}`) || list?.contract,
		abi: OpenPeerEscrow as Abi,
		functionName: 'balances',
		args: [list?.token?.address],
		enabled: instantEscrow,
		watch: true,
		chainId: list.chain_id
	});

	const { fee } = useEscrowFee({
		token,
		address: (sellerContract as `0x${string}`) || list?.contract,
		tokenAmount,
		chainId: list.chain_id
	});

	const resolver: Resolver = () => {
		const error: Errors = {};

		const { limit_min: limitMin, limit_max: limitMax, total_available_amount: totalAvailableAmount } = list;
		const max = Number(limitMax) || Number(totalAvailableAmount) * (price || 0);

		if (!fiatAmount) {
			error.fiatAmount = 'Should be bigger than 0';
		} else if (fiatAmount < (Number(limitMin) || 0)) {
			error.fiatAmount = `Should be more or equal ${limitMin}`;
		} else if (fiatAmount > max) {
			error.fiatAmount = `Should be less or equal ${max}`;
		}

		if (!tokenAmount) {
			error.tokenAmount = 'Should be bigger than 0';
		} else {
			const escrowFee = fee || BigInt(0);
			const escrowedBalance = ((balance as bigint) || BigInt(0)) - escrowFee;

			if (instantEscrow && escrowedBalance < parseUnits(String(tokenAmount), token.decimals)) {
				error.tokenAmount = `Only ${formatUnits(escrowedBalance, token.decimals)} ${
					token.symbol
				} is available in the escrow contract. Should be less or equal ${formatUnits(
					escrowedBalance,
					token.decimals
				)} ${token.symbol}.`;
			}
		}

		if (list.type === 'SellList' && !bank?.id) {
			error.bankId = 'Should be present';
		}

		return error;
	};

	const createOrder = async (newOrder: Order) => {
		const result = await fetch('/api/orders/', {
			method: 'POST',
			body: JSON.stringify(
				snakecaseKeys(
					{
						order: {
							listId: newOrder.list.id,
							fiatAmount: newOrder.fiat_amount,
							tokenAmount: newOrder.token_amount,
							price: newOrder.price,
							paymentMethod: { id: bank?.id }
						}
					},
					{ deep: true }
				)
			),
			headers: {
				Authorization: `Bearer ${getAuthToken()}`
			}
		});
		const { uuid } = await result.json();
		if (uuid) {
			router.push(`/orders/${uuid}`);
		}
	};

	const onProceed = async () => {
		if (acceptOnlyVerified && user && !user.verified) {
			router.push(`/${user.address}`);
			return;
		}

		if (list && price) {
			if (!validate(resolver)) return;

			const newOrder: UIOrder = {
				...order,
				...{ fiat_amount: fiatAmount!, token_amount: tokenAmount!, price }
			};

			if (list.type === 'SellList') {
				await createOrder(newOrder);
			} else {
				updateOrder({ ...newOrder, ...{ step: newOrder.step + 1 } });
			}
		}
	};

	function onChangeFiat(val: number | undefined) {
		clearErrors(['fiatAmount']);
		setFiatAmount(val);
		if (price && val) setTokenAmount(truncate(val / price, token.decimals));
	}

	function onChangeToken(val: number | undefined) {
		clearErrors(['tokenAmount']);

		setTokenAmount(val);
		if (price && val) setFiatAmount(val * price);
	}

	useEffect(() => {
		updateOrder({
			...order,
			...{ fiatAmount, tokenAmount }
		});
	}, [tokenAmount, fiatAmount]);

	useEffect(() => {
		updateOrder({
			...order,
			...{ paymentMethod: bank ? { id: bank.id, bank, values: {} } : undefined }
		});
	}, [bank]);

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

	useEffect(() => {
		if (list.type === 'SellList' && banks.length > 0 && !bank) {
			setBank(banks[0]);
		}
	}, [banks]);

	if (!user?.email) {
		return <AccountInfo setUser={setUser} />;
	}

	const buyCrypto = list.type === 'BuyList';
	const verificationRequired = acceptOnlyVerified && !user.verified;
	const buttonText = verificationRequired ? 'Verify' : '';

	return (
		<StepLayout onProceed={onProceed} buttonText={buttonText}>
			<div className="my-8">
				{verificationRequired ? (
					<h1>Only verified users can interact with this ad.</h1>
				) : (
					<>
						<Input
							label={buyCrypto ? 'Amount to sell' : 'Amount to buy'}
							prefix={<Prefix label={token!.name} image={<Token token={token} size={24} />} />}
							id="amountToReceive"
							value={tokenAmount}
							onChangeNumber={(t) => onChangeToken(t)}
							type="decimal"
							decimalScale={token.decimals}
							error={errors.tokenAmount}
						/>
						<Input
							label={buyCrypto ? "Amount you'll receive" : "Amount you'll pay"}
							prefix={
								<Prefix
									label={currency!.symbol}
									image={<Flag name={countries[currency.country_code]} size={24} />}
								/>
							}
							id="amountBuy"
							value={fiatAmount}
							onChangeNumber={(f) => onChangeFiat(f)}
							type="decimal"
							error={errors.fiatAmount}
						/>

						{!buyCrypto && (
							<BankSelect
								currencyId={currency.id}
								onSelect={(b) => setBank(b as Bank)}
								selected={bank}
								options={banks}
								error={errors.bankId}
							/>
						)}
					</>
				)}
			</div>
		</StepLayout>
	);
};

export default Amount;
