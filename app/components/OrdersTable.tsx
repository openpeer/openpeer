import { Avatar, Button, Flag } from 'components';
import { countries } from 'models/countries';
import { devChains } from 'models/networks';
import { Order, Token as TokenModel } from 'models/types';
import Link from 'next/link';
import React from 'react';
import { smallWalletAddress } from 'utils';
import { useAccount } from 'wagmi';

import { CheckBadgeIcon } from '@heroicons/react/24/solid';

import Token from './Token/Token';

interface OrdersTableProps {
	orders: Order[];
}

const NextButton = ({
	order: { buyer: buyerUser, uuid, status, seller },
	address
}: {
	order: Order;
	address: string | undefined;
}) => {
	const buyer = address === buyerUser.address;

	if (!buyer && seller.address !== address) {
		return <></>;
	}

	let label = 'Continue';
	if (buyer) {
		if (['created', 'release', 'cancelled', 'closed'].includes(status)) {
			label = 'See Order';
		}
	} else if (['escrowed', 'cancelled', 'closed'].includes(status)) {
		// seller
		label = 'See Order';
	}

	const url = `/orders/${encodeURIComponent(uuid)}`;

	return (
		<Link href={url}>
			<Button title={label} />
		</Link>
	);
};
const OrdersTable = ({ orders }: OrdersTableProps) => {
	const { address } = useAccount();
	if (!orders) return <p>No orders</p>;

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
			default:
				return 'Waiting';
		}
	};

	if (orders.length === 0) return <></>;

	return (
		<div>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
				<table className="w-full md:rounded-lg overflow-hidden">
					<thead className="bg-gray-100">
						<tr className="w-full relative">
							<th
								scope="col"
								className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
							>
								User
							</th>
							<th
								scope="col"
								className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
							>
								Chain
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
								list: { fiat_currency: currency, token, chain_id: chainId },
								price,
								fiat_amount: fiatAmount,
								token_amount: tokenAmount,
								status,
								buyer,
								seller
							} = order;
							const isSeller = address === seller.address;
							const user = isSeller ? buyer : seller;
							const network = devChains.find((chain) => chain.id === chainId);

							return (
								<tr key={id} className="hover:bg-gray-50">
									<td className="md:pl-4 py-4">
										<div className="w-full flex flex-row justify-around md:justify-start items-center">
											<div className="w-full">
												<Link href={`/${user.address}`}>
													<div className="flex flex-row items-center cursor-pointer">
														<Avatar user={user} className="w-5 md:w-10 aspect-square" />
														<div className="pl-1 md:pl-2 text-sm text-gray-900 text-ellipsis overflow-hidden">
															{user.name || smallWalletAddress(user.address)}
														</div>
														{user.verified && (
															<div className="pl-1 md:pl-2 text-sm text-gray-900 text-ellipsis overflow-hidden">
																<CheckBadgeIcon
																	width="18"
																	height="18"
																	className="text-cyan-600"
																/>
															</div>
														)}
													</div>
												</Link>
												<div className="mt-1 flex flex-col text-gray-500 block lg:hidden">
													<div className="flex flex-col space-y-1">
														<div className="flex flex-row items-center">
															<span className="pr-2 text-sm">Chain</span>
															<div className="flex flex-row items-center space-x-1">
																<Token
																	token={network?.nativeCurrency as TokenModel}
																	size={18}
																/>
															</div>
															<span className="pl-1 text-sm">{network?.name}</span>
														</div>
														<div className="flex flex-row items-center">
															<span className="pr-2 text-sm">Pay</span>
															<span className="text-base text-gray-900">
																{Number(fiatAmount).toFixed(2)}
															</span>
															<span className="pl-1 text-sm">{currency.code}</span>
														</div>
														<div className="flex flex-row items-center">
															<span className="pr-2 text-sm">Receive</span>
															<span className="text-base text-gray-900">
																{Number(tokenAmount).toFixed(2)}
															</span>
															<span className="pl-1 text-sm">{token.symbol}</span>
														</div>
														<span className="max-w-fit bg-gray-100 text-gray-400 text-xs m-0 py-1 px-2 rounded-md">
															{orderStatus(status)}
														</span>
													</div>
												</div>
											</div>
											<div className="w-full md:w-2/5 flex flex-col lg:hidden px-4">
												<NextButton order={order} address={address} />
											</div>
										</div>
									</td>
									<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
										<div className="flex flex-row items-center space-x-1">
											<Token token={network?.nativeCurrency as TokenModel} size={24} />
											<span>{network?.name}</span>
										</div>
									</td>
									<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
										<div className="flex flex-row items-center space-x-1">
											<Flag name={countries[currency.country_code]} size={24} />
											<span>
												{currency.symbol} {Number(price).toFixed(2)}
											</span>
										</div>
									</td>
									<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
										<div className="flex flex-row items-center space-x-1">
											<Flag name={countries[currency.country_code]} size={24} />
											<span>
												{currency.symbol} {Number(fiatAmount).toFixed(2)}
											</span>
										</div>
									</td>
									<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
										<div className="flex flex-row items-center space-x-1">
											<Token token={token} size={24} />
											<span>
												{Number(tokenAmount).toFixed(2)} {token.symbol}
											</span>
										</div>
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
	);
};
export default OrdersTable;
