import { useChains } from 'connectkit';
import { countries } from 'models/countries';
import { Token as TokenType, List } from 'models/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { smallWalletAddress } from 'utils';
import { useAccount } from 'wagmi';

import Avatar from './Avatar';
import Button from './Button/Button';
import EditListButtons from './Button/EditListButtons';
import Flag from './Flag/Flag';
import Token from './Token/Token';

interface ListsTableProps {
	lists: List[];
	fiatAmount?: number;
	tokenAmount?: number;
}

interface BuyButtonProps {
	id: number;
	fiatAmount: number | undefined;
	tokenAmount: number | undefined;
	sellList: boolean;
}

const BuyButton = ({ id, fiatAmount, tokenAmount, sellList }: BuyButtonProps) => (
	<Link
		href={{ pathname: `/buy/${encodeURIComponent(id)}`, query: { fiatAmount, tokenAmount } }}
		as={`/buy/${encodeURIComponent(id)}`}
	>
		<Button title={sellList ? 'Buy' : 'Sell'} />
	</Link>
);

const ListsTable = ({ lists, fiatAmount, tokenAmount }: ListsTableProps) => {
	const { address } = useAccount();
	const chains = useChains();

	return (
		<table className="w-full md:rounded-lg overflow-hidden">
			<thead className="bg-gray-100">
				<tr className="w-full relative">
					<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
						Seller
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
						token,
						fiat_currency: { symbol: fiatSymbol, country_code: countryCode } = {},
						limit_min: min,
						limit_max: max,
						price,
						payment_method: paymentMethod,
						chain_id: chainId
					} = list;
					const { address: sellerAddress, name } = seller;
					const isSeller = sellerAddress === address;
					const bank = paymentMethod?.bank || list.bank;
					const { symbol } = token;
					const chain = chains.find((c) => c.id === chainId);
					const chainToken = chain?.nativeCurrency;

					return (
						<tr key={id} className="hover:bg-gray-50">
							<td className="pl-4 py-4">
								<div className="w-full flex flex-row justify-around md:justify-start items-center">
									<div className="w-3/5 mr-6">
										<Link href={`/${sellerAddress}`}>
											<div className="flex flex-row items-center cursor-pointer">
												<Avatar user={seller} className="w-5 md:w-10 aspect-square" />
												<div className="pl-1 md:pl-2 text-sm text-gray-900 text-ellipsis overflow-hidden">
													{name || smallWalletAddress(sellerAddress)}
												</div>
											</div>
										</Link>
										<div className="mt-1 flex flex-col text-gray-500 block lg:hidden">
											<div className="flex flex-col space-y-1">
												<div className="flex flex-row items-center">
													<div className="flex flex-col">
														<div className="flex flex-row items-center">
															<span className="pr-2 text-sm">Price</span>
															<span>
																<Flag name={countries[countryCode!]} size={20} />
															</span>
															<span className="-ml-2 border-2 border-white rounded-full">
																<Token token={token} size={20} />
															</span>
														</div>
														<span className="mb-2">
															<div className="flex flex-row items-center">
																<span className="pr-1 text-sm text-gray-800">
																	{fiatSymbol} {Number(price).toFixed(2)} per
																</span>
																<span className="text-sm text-gray-800">{symbol}</span>
															</div>
														</span>
													</div>
												</div>
												<div className="flex flex-row items-center">
													<span className="pr-2 text-sm">{chain?.name}</span>
													<Token token={chainToken! as TokenType} size={20} />
												</div>
												<div className="flex flex-row items-center">
													<span className="pr-2 text-sm">Available</span>
													<Token token={token} size={20} />
												</div>
												<div className="flex flex-row items-center">
													<span className="mr-2 text-sm text-gray-800">
														{amount} {symbol}
													</span>
												</div>
												<div className="flex flex-row items-center">
													<span className="pr-2 text-sm">{bank.name}</span>
													<Image
														src={bank.icon}
														alt={bank.name}
														className="h-6 w-6 flex-shrink-0 rounded-full mr-1"
														width={24}
														height={24}
														unoptimized
													/>
												</div>
											</div>
										</div>
									</div>
									<div className="w-2/5 flex flex-col lg:hidden px-4">
										{isSeller ? (
											<EditListButtons id={list.id} />
										) : (
											<BuyButton
												id={list.id}
												fiatAmount={fiatAmount}
												tokenAmount={tokenAmount}
												sellList={list.type === 'SellList'}
											/>
										)}
									</div>
								</div>
							</td>
							<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
								<div className="flex flex-row items-center space-x-1">
									<Token token={chainToken! as TokenType} size={24} />
									<span>{chain?.name}</span>
								</div>
							</td>
							<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
								<div className="flex flex-row items-center space-x-1">
									<Token token={token} size={24} />
									<span>
										{amount} {symbol}
									</span>
								</div>
							</td>
							<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
								<div className="flex flex-row items-center space-x-1">
									<Flag name={countries[countryCode!]} size={24} />
									<span>
										{fiatSymbol} {Number(price).toFixed(2)} per {symbol}
									</span>
								</div>
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
								{isSeller ? (
									<EditListButtons id={list.id} />
								) : (
									<BuyButton
										id={list.id}
										fiatAmount={fiatAmount}
										tokenAmount={tokenAmount}
										sellList={list.type === 'SellList'}
									/>
								)}
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export default ListsTable;
