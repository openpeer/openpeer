import { Accordion, Loading } from 'components';
import OrdersTable from 'components/OrdersTable';
import WrongNetwork from 'components/WrongNetwork';
import { useConnection } from 'hooks';
import { Order } from 'models/types';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

const OrdersPage = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setLoading] = useState(false);
	const { address } = useAccount();
	const { wrongNetwork, status } = useConnection();

	useEffect(() => {
		if (status !== 'authenticated') return;

		setLoading(true);
		fetch('/api/orders')
			.then((res) => res.json())
			.then((data) => {
				setOrders(data);
				setLoading(false);
			});
	}, [address, status]);

	if (wrongNetwork) return <WrongNetwork />;
	if (status === 'loading' || isLoading) return <Loading />;

	const { activeOrders, closedOrders, cancelledOrders } = orders.reduce(
		(acc: { [key: string]: Order[] }, order) => {
			switch (order.status) {
				case 'closed':
					acc.closedOrders.push(order);
					break;
				case 'cancelled':
					acc.cancelledOrders.push(order);
					break;
				default:
					acc.activeOrders.push(order);
			}
			return acc;
		},
		{ activeOrders: [], closedOrders: [], cancelledOrders: [] }
	);

	return (
		<>
			<div className="mx-auto max-w-7xl sm:px-0 md:px-8">
				<Accordion content={<OrdersTable orders={activeOrders} />} title="Active orders" open />
				{closedOrders.length > 0 && (
					<Accordion content={<OrdersTable orders={closedOrders} />} title="Closed orders" />
				)}
				{cancelledOrders.length > 0 && (
					<Accordion content={<OrdersTable orders={cancelledOrders} />} title="Cancelled orders" />
				)}
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
