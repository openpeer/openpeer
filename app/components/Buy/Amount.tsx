import Flag from 'components/Flag/Flag';
import Input from 'components/Input/Input';
import StepLayout from 'components/Listing/StepLayout';
import Token from 'components/Token/Token';
import { useCreateOrder, useFormErrors } from 'hooks';
import { countries } from 'models/countries';
import { Errors, Resolver } from 'models/errors';
import { List } from 'models/types';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import snakecaseKeys from 'snakecase-keys';
import { truncate } from 'utils';
import { useAccount } from 'wagmi';

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
	const { fiatAmount: quickBuyFiat, tokenAmount: quickBuyToken } = router.query;
	const { list = {} as List, token_amount: orderTokenAmount, fiat_amount: orderFiatAmount } = order;
	const { address } = useAccount();
	const { fiat_currency: currency, token, type } = list;

	const [fiatAmount, setFiatAmount] = useState<number | undefined>(
		orderFiatAmount || quickBuyFiat ? Number(quickBuyFiat) : undefined
	);
	const [tokenAmount, setTokenAmount] = useState<number | undefined>(
		orderTokenAmount || quickBuyToken ? Number(quickBuyToken) : undefined
	);

	const { errors, clearErrors, validate } = useFormErrors();

	const { createOrder } = useCreateOrder({
		address: address!,
		listId: order.list.id,
		fiatAmount: fiatAmount!,
		tokenAmount: fiatAmount!,
		price: price!,
		onSuccess: (uuid: string) => {
			if (uuid) {
				router.push(`/orders/${uuid}`);
			}
		}
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
		}

		return error;
	};

	const onProceed = () => {
		if (list && price) {
			if (!validate(resolver)) return;

			const newOrder: UIOrder = {
				...order,
				...{ fiat_amount: fiatAmount!, token_amount: tokenAmount!, price }
			};

			if (type === 'SellList') {
				updateOrder(newOrder);

				const message = JSON.stringify(
					snakecaseKeys(
						{
							listId: newOrder.list.id,
							fiatAmount: newOrder.fiat_amount,
							tokenAmount: newOrder.token_amount,
							price
						},
						{ deep: true }
					),
					undefined,
					4
				);
				createOrder({ message });
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
		updateOrder({ ...order, ...{ fiatAmount, tokenAmount } });
	}, [tokenAmount, fiatAmount]);

	const buyCrypto = list.type === 'BuyList';
	const buttonText = buyCrypto ? '' : 'Sign and Continue';
	return (
		<StepLayout onProceed={onProceed} buttonText={buttonText}>
			<div className="my-8">
				<Input
					label={buyCrypto ? "Amount you'll receive" : 'Amount to buy'}
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
				<Input
					label={buyCrypto ? 'Amount to sell' : "Amount you'll receive"}
					prefix={<Prefix label={token!.name} image={<Token token={token} size={24} />} />}
					id="amountToReceive"
					value={tokenAmount}
					onChangeNumber={(t) => onChangeToken(t)}
					type="decimal"
					decimalScale={token.decimals}
					error={errors.tokenAmount}
				/>
			</div>
		</StepLayout>
	);
};

export default Amount;
