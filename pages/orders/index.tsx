// pages/orders/index.tsx
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { Accordion, Loading } from 'components';
import OrdersTable from 'components/OrdersTable';
import { Order } from 'models/types';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'hooks';
import qs from 'qs';

const OrdersPage = () => {
	const [activeOrders, setActiveOrders] = useState<Order[]>([]);
	const [closedOrders, setClosedOrders] = useState<Order[]>([]);
	const [isLoadingActive, setLoadingActive] = useState(false);
	const [loadedClosed, setLoadedClosed] = useState(false);
	const [isLoadingClosed, setLoadingClosed] = useState(false);
	const [cancelledOrders, setCancelledOrders] = useState<Order[]>([]);
	const [loadedCancelled, setLoadedCancelled] = useState(false);
	const [isLoadingCancelled, setLoadingCancelled] = useState(false);
	const { address } = useAccount();

	const fetchOrders = async (status: Order['status'][], type: 'active' | 'closed' | 'cancelled') => {
		if (!address) return;

		const loadingFunction =
			type === 'active' ? setLoadingActive : type === 'closed' ? setLoadingClosed : setLoadingCancelled;

		const setFunction =
			type === 'active' ? setActiveOrders : type === 'closed' ? setClosedOrders : setCancelledOrders;

		loadingFunction(true);
		fetch(`/api/orders?${qs.stringify({ status })}`, {
			headers: {
				Authorization: `Bearer ${getAuthToken()}`
			}
		})
			.then((res) => res.json())
			.then((data) => {
				let orders = data.filter(
					(order: Order) =>
						!(
							order.seller.address === address &&
							order.list.escrow_type === 'instant' &&
							order.status === 'created'
						)
				);

				// Sort orders by created_at for all types
				orders = orders.sort(
					(a: Order, b: Order) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
				);

				setFunction(orders);
				loadingFunction(false);
			});
	};

	useEffect(() => {
		fetchOrders(['escrowed', 'release', 'dispute', 'created'], 'active');
	}, [address]);

	const onOpenClosedOrders = () => {
		if (loadedClosed) return;

		fetchOrders(['closed'], 'closed');
		setLoadedClosed(true);
	};

	const onOpenCancelledOrders = () => {
		if (loadedCancelled) return;

		fetchOrders(['cancelled'], 'cancelled');
		setLoadedCancelled(true);
	};

	return (
		<>
			<div className="mx-auto sm:px-0 md:px-4 mb-8">
				<Accordion
					content={isLoadingActive ? <Loading /> : <OrdersTable orders={activeOrders} />}
					title="Active orders"
					open
				/>
				<Accordion
					content={isLoadingClosed ? <Loading /> : <OrdersTable orders={closedOrders} />}
					title="Closed orders"
					onOpen={onOpenClosedOrders}
				/>
				<Accordion
					content={isLoadingCancelled ? <Loading /> : <OrdersTable orders={cancelledOrders} />}
					title="Cancelled orders"
					onOpen={onOpenCancelledOrders}
				/>
			</div>
		</>
	);
};
export default OrdersPage;

export async function getServerSideProps() {
	return {
		props: { title: 'My Trades' } // will be passed to the page component as props
	};
}
