import Input from 'components/Input/Input';
import StepLayout from 'components/Listing/StepLayout';
import Image from 'next/image';
import { useState } from 'react';

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
	const { list } = order;

	const onProceed = () => {
		if (fiatAmount && tokenAmount) {
			const { limit_min: limitMin, limit_max: limitMax } = list;
			if (limitMin && fiatAmount < limitMin) return;
			if (limitMax && fiatAmount > limitMax) return;
			updateOrder({ ...order, ...{ step: order.step + 1 } });
		}
	};

	const [fiatAmount, setFiatAmount] = useState<number>();
	const [tokenAmount, setTokenAmount] = useState<number>();

	function onChangeFiat(val: number | undefined) {
		setFiatAmount(val);
		if (price && val) setTokenAmount(val / price);
	}
	function onChangeToken(val: number | undefined) {
		setTokenAmount(val);
		if (price && val) setFiatAmount(val * price);
	}

	const format = (s: string, updater: (s: number | undefined) => void) => {
		if (s) {
			updater(Number(s.replace(/[^0-9,|.]/g, '')));
		} else {
			updater(undefined);
		}
	};

	return (
		<StepLayout onProceed={onProceed} buttonText="Continue">
			<div className="my-8">
				<Input
					label="Amount to buy"
					prefix={<Prefix label={list.fiat_currency!.symbol} imageSRC={list.fiat_currency!.icon} />}
					id="amountBuy"
					value={fiatAmount}
					onChange={(s) => format(s, onChangeFiat)}
					type="number"
				/>
				<Input
					label="Amount you'll receive"
					prefix={<Prefix label={list.token!.name} imageSRC={list.token!.icon} />}
					id="amountToReceive"
					value={tokenAmount}
					onChange={(s) => format(s, onChangeToken)}
					type="number"
				/>
			</div>
		</StepLayout>
	);
};

export default Amount;
