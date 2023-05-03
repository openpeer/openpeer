import { useCreateOrder, useListPrice } from 'hooks';
import { List } from 'models/types';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import snakecaseKeys from 'snakecase-keys';
import { useAccount } from 'wagmi';

import { useConnectModal } from '@rainbow-me/rainbowkit';

import Button from './Button';

interface BuyButtonProps {
	list: List;
	fiatAmount: number | undefined;
	tokenAmount: number | undefined;
	sellList: boolean;
	skipAmount?: boolean;
}

const BuyButton = ({ list, fiatAmount, tokenAmount, sellList, skipAmount }: BuyButtonProps) => {
	const { id } = list;
	const { address } = useAccount();
	const { price = 0 } = useListPrice(list);
	const router = useRouter();
	const { openConnectModal } = useConnectModal();
	const { status } = useSession();

	const { createOrder } = useCreateOrder({
		address: address!,
		listId: id,
		fiatAmount: fiatAmount || tokenAmount! * price,
		tokenAmount: tokenAmount! || fiatAmount! / price,
		price: price!,
		onSuccess: (uuid: string) => {
			if (uuid) {
				router.push(`/orders/${uuid}`);
			}
		}
	});

	if (skipAmount) {
		const message = JSON.stringify(
			snakecaseKeys(
				{
					listId: id,
					fiatAmount: fiatAmount || tokenAmount! * price,
					tokenAmount: tokenAmount! || fiatAmount! / price,
					price
				},
				{ deep: true }
			),
			undefined,
			4
		);

		return (
			<Button
				title={sellList ? 'Buy' : 'Sell'}
				onClick={status === 'authenticated' ? () => createOrder({ message }) : openConnectModal}
			/>
		);
	}
	return (
		<Link
			href={{ pathname: `/buy/${encodeURIComponent(id)}`, query: { fiatAmount, tokenAmount } }}
			as={`/buy/${encodeURIComponent(id)}`}
		>
			<Button title={sellList ? 'Buy' : 'Sell'} />
		</Link>
	);
};

export default BuyButton;
