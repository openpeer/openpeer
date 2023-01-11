import Input from 'components/Input/Input';
import StepLayout from 'components/Listing/StepLayout';
import { List } from 'models/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { BuyStepProps } from './Buy.types';

interface BuyAmountStepProps extends BuyStepProps {
	price: number | undefined;
}

const Prefix = ({ label, imageSRC }: { label: string; imageSRC: string }) => (
	<div className="w-24 pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
		<div className="flex flex-row">
			<span className="mr-2">
				<Image
					src={imageSRC}
					alt={label}
					className="h-6 w-6 flex-shrink-0 rounded-full"
					width={24}
					height={24}
				/>
			</span>
			<span className="text-gray-500">{label}</span>
		</div>
	</div>
);

const Amount = ({ order, updateOrder, price }: BuyAmountStepProps) => {
	const { list = {} as List, tokenAmount: orderTokenAmount, fiatAmount: orderFiatAmount } = order;

	const { fiat_currency: currency, token } = list;

	const onProceed = () => {
		if (list && fiatAmount && tokenAmount && price) {
			const { limit_min: limitMin, limit_max: limitMax, total_available_amount: totalAvailableAmount } = list;
			if (fiatAmount < (limitMin || 0)) return;
			if (fiatAmount > (limitMax || Number(totalAvailableAmount) * price)) return;
			updateOrder({ ...order, ...{ step: order.step + 1, fiatAmount, tokenAmount } });
		}
	};

	const [fiatAmount, setFiatAmount] = useState<number | undefined>(orderFiatAmount);
	const [tokenAmount, setTokenAmount] = useState<number | undefined>(orderTokenAmount);

	function onChangeFiat(val: number | undefined) {
		setFiatAmount(val);
		if (price && val) setTokenAmount(val / price);
	}
	function onChangeToken(val: number | undefined) {
		setTokenAmount(val);
		if (price && val) setFiatAmount(val * price);
	}

	useEffect(() => {
		updateOrder({ ...order, ...{ fiatAmount, tokenAmount } });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tokenAmount, fiatAmount]);

	return (
		<StepLayout onProceed={onProceed} buttonText="Continue">
			<div className="my-8">
				<Input
					label="Amount to buy"
					prefix={<Prefix label={currency!.symbol} imageSRC={currency!.icon} />}
					id="amountBuy"
					value={fiatAmount}
					onChangeNumber={onChangeFiat}
					type="decimal"
				/>
				<Input
					label="Amount you'll receive"
					prefix={<Prefix label={token!.name} imageSRC={token!.icon} />}
					id="amountToReceive"
					value={tokenAmount}
					onChangeNumber={onChangeToken}
					type="decimal"
				/>
			</div>
		</StepLayout>
	);
};

export default Amount;
