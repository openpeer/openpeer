/* eslint-disable jsx-a11y/anchor-is-valid */
import { List } from 'models/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { smallWalletAddress } from 'utils';
import { useAccount } from 'wagmi';

import Avatar from './Avatar';
import BuyButton from './Button/BuyButton';

interface ListsTableProps {
	lists: List[];
	fiatAmount?: number;
	tokenAmount?: number;
	skipAmount?: boolean;
}

const ListsTable = ({ lists, fiatAmount, tokenAmount, skipAmount }: ListsTableProps) => {
	const { address } = useAccount();

	return (
		<div className="py-6">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
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
								Available
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
								Min-Max Order
							</th>
							<th
								scope="col"
								className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
							>
								Payment Method
							</th>
							<th
								scope="col"
								className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
							>
								Trade
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
						{lists.map((list) => {
							const {
								id,
								total_available_amount: amount,
								seller,
								token: { symbol },
								fiat_currency: { symbol: fiatSymbol },
								limit_min: min,
								limit_max: max,
								price,
								payment_method: paymentMethod
							} = list;
							const { address: sellerAddress, name } = seller;
							const canBuy = sellerAddress !== address;
							const bank = paymentMethod?.bank || list.bank;

							return (
								<tr key={id} className="hover:bg-gray-50">
									<td className="pl-4 py-4">
										<div className="w-full flex flex-row justify-around md:justify-start items-center">
											<div className="w-1/2 mr-6">
												<Link href={skipAmount ? '#' : `/${sellerAddress}`}>
													<div className="flex flex-col lg:flex-row lg:items-center cursor-pointer">
														<div className="w-16 flex flex-row mb-2">
															<Avatar user={seller} />
														</div>
														<div className="text-sm text-gray-900 break-all">
															{name || smallWalletAddress(sellerAddress)}
														</div>
													</div>
												</Link>
												<div className="mt-1 flex flex-col text-gray-500 block lg:hidden">
													<span>
														{amount} {symbol}
													</span>
												</div>
											</div>
											<div className="w-1/2 flex flex-col lg:hidden">
												<span className="font-bold mb-2">
													{fiatSymbol} {Number(price).toFixed(2)} per {symbol}
												</span>
												{canBuy && (
													<BuyButton
														list={list}
														fiatAmount={fiatAmount}
														tokenAmount={tokenAmount}
														sellList={list.type === 'SellList'}
														skipAmount={skipAmount}
													/>
												)}
											</div>
										</div>
									</td>
									<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
										{amount} {symbol}
									</td>
									<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
										{fiatSymbol} {Number(price).toFixed(2)} per {symbol}
									</td>
									<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
										{(!!min || !!max) && `${fiatSymbol} ${min || 10} - ${fiatSymbol}${max || '∞'}`}
									</td>
									<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
										<div className="flex flex-row items-center">
											<Image
												src={bank.icon}
												alt={bank.name}
												className="h-6 w-6 flex-shrink-0 rounded-full mr-1"
												width={24}
												height={24}
												unoptimized
											/>
											<span>{bank.name}</span>
										</div>
									</td>
									<td className="hidden text-right py-4 pr-4 lg:table-cell">
										{canBuy && (
											<BuyButton
												list={list}
												fiatAmount={fiatAmount}
												tokenAmount={tokenAmount}
												sellList={list.type === 'SellList'}
												skipAmount={skipAmount}
											/>
										)}
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

export default ListsTable;
