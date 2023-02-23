import { Avatar, Button, Loading } from 'components';
import WrongNetwork from 'components/WrongNetwork';
import { useConnection } from 'hooks';
import { Order } from 'models/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

const NextButton = ({
	order: { buyer: buyerUser, uuid, status },
	address
}: {
	order: Order;
	address: string | undefined;
}) => {
	const buyer = address === buyerUser.address;
	// buyer
	if (buyer) {
		if (['created', 'release', 'cancelled', 'closed'].includes(status)) {
			return <></>;
		}
	} else if (['escrowed', 'cancelled', 'closed'].includes(status)) {
		// seller
		return <></>;
	}

	return (
		<Link href={`/orders/${encodeURIComponent(uuid)}`}>
			<Button title="Continue" />
		</Link>
	);
};
const OrdersPage = () => {
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setLoading] = useState(false);
	const { chain, chains } = useNetwork();
	const chainId = chain?.id || chains[0]?.id;
	const { address } = useAccount();
	const { wrongNetwork, status } = useConnection();

	useEffect(() => {
		if (status !== 'authenticated') return;

		setLoading(true);
		fetch(`/api/orders?chain_id=${chainId}`)
			.then((res) => res.json())
			.then((data) => {
				setOrders(data.filter((o: Order) => !['closed', 'cancelled'].includes(o.status)));
				setLoading(false);
			});
	}, [chainId, address, status]);

	if (!orders) return <p>No orders</p>;
	if (wrongNetwork) return <WrongNetwork />;
	if (status === 'loading' || isLoading) return <Loading />;

	const orderStatus = (status: Order['status']) => {
		switch (status) {
			case 'created': {
				return 'Waiting seller deposit';
			}
			case 'escrowed': {
				return 'Waiting payment';
			}
			case 'release': {
				return 'Waiting seller release';
			}
			case 'dispute': {
				return 'In dispute';
			}
			case 'closed': {
				return 'Finished';
			}
			case 'cancelled': {
				return 'Cancelled';
			}
		}
	};

	return (
		<div className="py-6">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
				<div className="py-4">
					<table className="w-full md:rounded-lg overflow-hidden">
						<thead className="bg-gray-100">
							<tr className="w-full relative">
								<th
									scope="col"
									className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
								>
									Merchant
								</th>
								<th
									scope="col"
									className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
								>
									Price
								</th>
								<th
									scope="col"
									className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
								>
									Pay
								</th>
								<th
									scope="col"
									className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
								>
									Receive
								</th>
								<th
									scope="col"
									className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
								>
									Status
								</th>
								<th
									scope="col"
									className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
								>
									&nbsp;
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 bg-white">
							{orders.map((order) => {
								const {
									id,
									list: { seller, fiat_currency: currency, token },
									price,
									fiat_amount: fiatAmount,
									token_amount: tokenAmount,
									status
								} = order;
								return (
									<tr key={id} className="hover:bg-gray-50">
										<td className="pl-4 py-4">
											<div className="w-full flex flex-row justify-around md:justify-start items-center">
												<div className="w-3/5 mr-6">
													<Link href={`/${seller.address}`}>
														<div className="flex flex-col lg:flex-row lg:items-center cursor-pointer">
															<div className="w-1/3 flex flex-row mb-2">
																<Avatar user={seller} />
															</div>
															<div className="text-sm text-gray-900 break-all">
																{seller.name || seller.address}
															</div>
														</div>
													</Link>
													<div className="mt-1 flex flex-col text-gray-500 block lg:hidden">
														<span>
															{currency.symbol} {fiatAmount}
														</span>
														<span>{orderStatus(status)}</span>
													</div>
												</div>
												<div className="w-2/5 flex flex-col lg:hidden px-4">
													<span className="font-bold mb-2">
														{Number(tokenAmount).toFixed(2)} {token.symbol}
													</span>
													<NextButton order={order} address={address} />
												</div>
											</div>
										</td>
										<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
											{currency.symbol} {price}
										</td>
										<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
											{currency.symbol} {fiatAmount}
										</td>
										<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
											{Number(tokenAmount).toFixed(2)} {token.symbol}
										</td>
										<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
											{orderStatus(status)}
										</td>
										<td className="hidden text-right py-4 pr-4 lg:table-cell">
											<NextButton order={order} address={address} />
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};
export default OrdersPage;

export async function getServerSideProps() {
	return {
		props: { title: 'Orders' } // will be passed to the page component as props
	};
}
