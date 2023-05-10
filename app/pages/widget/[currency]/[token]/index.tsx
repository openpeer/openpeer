import { ListsTable, Loading } from 'components';
import OrdersTable from 'components/OrdersTable';
import { useConnection } from 'hooks';
import { List, Order } from 'models/types';
import React, { useEffect, useState } from 'react';
import { useChainId } from 'wagmi';

import { useConnectModal } from '@rainbow-me/rainbowkit';

interface WidgetProps {
	currency: string;
	token: string;
	fiatAmount: number;
	tokenAmount: number;
}

const Widget = ({ currency, token, fiatAmount, tokenAmount }: WidgetProps) => {
	const [lists, setLists] = useState<List[]>([]);
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(false);
	const chainId = useChainId();
	const { openConnectModal } = useConnectModal();
	const { status } = useConnection();

	useEffect(() => {
		if (status !== 'authenticated') {
			openConnectModal?.();
		}
	}, [openConnectModal, status]);

	useEffect(() => {
		const search = async () => {
			if (!currency || !token || !(fiatAmount || tokenAmount)) return;
			setLoading(true);
			try {
				const params = {
					type: 'SellList',
					chain_id: String(chainId),
					fiat_currency_code: currency,
					token_address: token,
					token_amount: String(fiatAmount || ''),
					fiat_amount: String(tokenAmount || '')
				};

				const filteredParams = Object.fromEntries(
					Object.entries(params).filter(([, value]) => value !== undefined)
				);
				const response = await fetch(`/api/quickbuy?${new URLSearchParams(filteredParams).toString()}`);
				const searchLists: List[] = await response.json();
				setLists(searchLists);
			} catch {
				setLoading(false);
			}
			setLoading(false);
		};

		search();
	}, [currency, token]);

	useEffect(() => {
		if (status !== 'authenticated') return;

		setLoading(true);
		fetch(`/api/orders?chain_id=${chainId}`)
			.then((res) => res.json())
			.then((data: Order[]) => {
				setOrders(data.filter((o) => !['cancelled', 'closed'].includes(o.status)));
				setLoading(false);
			});
	}, [chainId, status]);

	if (loading) return <Loading />;

	return (
		<>
			{orders.length > 0 && (
				<>
					<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-2">
						<span className="font-semibold text-lg">Your pending orders</span>
					</div>
					<OrdersTable orders={orders} />
				</>
			)}
			{lists.length > 0 && (
				<ListsTable lists={lists} fiatAmount={fiatAmount} tokenAmount={tokenAmount} skipAmount />
			)}
		</>
	);
};

Widget.getInitialProps = async (ctx: any) => {
	const { currency, token, fiatAmount, tokenAmount } = ctx.query;
	return { widget: true, currency, token, fiatAmount, tokenAmount };
};

export default Widget;
