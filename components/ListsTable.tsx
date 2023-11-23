/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/indent */
import { useDynamicContext } from '@dynamic-labs/sdk-react';
import { countries } from 'models/countries';
import { Token as TokenType, List } from 'models/types';
import Link from 'next/link';
import React from 'react';
import { getChainToken, smallWalletAddress } from 'utils';
import { ClockIcon } from '@heroicons/react/24/outline';

import { allChains } from 'models/networks';
import { useAccount, useUserProfile } from 'hooks';
import { useContractReads } from 'wagmi';
import { OpenPeerEscrow } from 'abis';
import { Abi, formatUnits } from 'viem';
import Avatar from './Avatar';
import Button from './Button/Button';
import EditListButtons from './Button/EditListButtons';
import Flag from './Flag/Flag';
import Token from './Token/Token';
import IdVerificationNeeded from './IdVerificationNeeded';

interface ListsTableProps {
	lists: List[];
	fiatAmount?: number;
	tokenAmount?: number;
	hideLowAmounts?: boolean;
}

interface BuyButtonProps {
	fiatAmount: number | undefined;
	tokenAmount: number | undefined;
	list: List;
}

const BuyButton = ({ fiatAmount, tokenAmount, list }: BuyButtonProps) => {
	const {
		id,
		escrow_type: escrowType,
		token: { symbol },
		type
	} = list;
	const sellList = type === 'SellList';
	let fiat = fiatAmount;
	let token = tokenAmount;

	if (token) {
		fiat = Number(token) * Number(list.price);
	} else if (fiat) {
		token = Number(fiat) / Number(list.price);
	}

	return (
		<Link
			href={{ pathname: `/buy/${encodeURIComponent(id)}`, query: { fiatAmount: fiat, tokenAmount: token } }}
			as={`/buy/${encodeURIComponent(id)}`}
		>
			<Button
				title={sellList ? (escrowType === 'instant' ? `Buy ${symbol} ⚡` : `Buy ${symbol}`) : `Sell ${symbol}`}
			/>
		</Link>
	);
};

const ListsTable = ({ lists, fiatAmount, tokenAmount, hideLowAmounts }: ListsTableProps) => {
	const { address } = useAccount();
	const { primaryWallet } = useDynamicContext();
	const chains = allChains;
	const { user } = useUserProfile({});

	const contracts = lists
		.filter(({ contract }) => !!contract)
		.map((list) => ({ id: list.id, contract: list.contract, token: list.token.address, chainId: list.chain_id }));

	let signatures = contracts.map((item) => {
		const { contract, token, chainId } = item;
		return {
			address: contract,
			abi: OpenPeerEscrow as Abi,
			functionName: 'balances',
			args: [token],
			chainId
		};
	});

	// remove duplicates with the same address, args and chainId
	signatures = signatures.filter(
		(item, index, self) =>
			index ===
			self.findIndex(
				(t) => t.address === item.address && t.args[0] === item.args[0] && t.chainId === item.chainId
			)
	);
	const { data, isLoading } = useContractReads({ contracts: signatures });
	const showVerification = user && !user.verified;

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
						Payment time limit
					</th>
					<th
						scope="col"
						className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
					>
						Payment Methods
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
						payment_methods: paymentMethods,
						chain_id: chainId,
						// token_spot_price: tokenSpotPrice,
						payment_time_limit: paymentTimeLimit,
						escrow_type: escrowType,
						type,
						accept_only_verified: acceptOnlyVerified
					} = list;
					const banks = type === 'BuyList' ? list.banks : paymentMethods.map((pm) => pm.bank);
					const { address: sellerAddress, name } = seller;
					const isSeller = primaryWallet && sellerAddress === address;
					const { symbol, minimum_amount: minimumAmount } = token;
					const chain = chains.find((c) => c.id === chainId);
					const chainToken = getChainToken(chain);

					// const priceDifferencePercentage =
					// tokenSpotPrice && price ? (price / tokenSpotPrice) * 100 - 100 : 0;

					const priceDifferencePercentage = 100;
					const instantEscrow = escrowType === 'instant';
					let escrowedAmount = amount;

					try {
						if (instantEscrow && !isLoading && data) {
							const dataIndex = signatures.findIndex(
								(item) => item.address === list.contract && item.args[0] === list.token.address
							);
							if (dataIndex !== -1) {
								const { status, result } = data[dataIndex];
								if (status === 'success') {
									escrowedAmount = formatUnits(result as bigint, token.decimals);
								}
							}
						}
					} catch (err) {
						console.log(err);
					}

					if (hideLowAmounts && Number(escrowedAmount) <= Number(minimumAmount || '0')) {
						return <></>;
					}

					return (
						<tr key={id} className="hover:bg-gray-50">
							<td className="lg:pl-4 py-4">
								<div className="w-full flex flex-col">
									<div className="w-full flex flex-row justify-around md:justify-start items-center">
										<div className="w-full mr-6">
											<Link href={`/${sellerAddress}`}>
												<div className="flex flex-row items-center cursor-pointer">
													<Avatar user={seller} className="w-5 md:w-10 aspect-square" />
													<div className="flex flex-col">
														<div className="pl-1 md:pl-2 text-sm text-gray-900 text-ellipsis overflow-hidden">
															{name || smallWalletAddress(sellerAddress)}
														</div>
														{seller.online !== null && (
															<div className="pl-1 md:pl-2 text-sm">
																{seller.online ? (
																	<div className="flex flex-row items-center space-x-1">
																		<div className="w-2 h-2 bg-green-500 rounded-full" />
																		<span className="text-green-500 text-xs">
																			Online
																		</span>
																	</div>
																) : (
																	<div className="flex flex-row items-center space-x-1">
																		<div className="w-2 h-2 bg-orange-500 rounded-full" />
																		<span className="text-orange-500 text-xs">
																			Not online now
																		</span>
																	</div>
																)}
															</div>
														)}
													</div>
												</div>
											</Link>
											<div className="mt-2 flex flex-col text-gray-500 lg:hidden">
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
																	<span className="text-sm text-gray-800">
																		{symbol}
																	</span>
																</div>
															</span>
														</div>
													</div>

													<div className="flex flex-row items-center">
														<span className="pr-2 text-sm">Available</span>
														<Token token={token} size={20} />
													</div>
													<div className="flex flex-row items-center">
														<span className="mr-2 text-sm text-gray-800">
															{Number(escrowedAmount).toFixed(2)} {symbol}
														</span>
													</div>
													{showVerification && acceptOnlyVerified && <IdVerificationNeeded />}
												</div>
											</div>
										</div>
										<div className="bg-gray-100 p-2 rounded-md w-1/2 flex flex-col lg:hidden px-4">
											{/* left */}
											<div className="flex flex-row items-center mb-2">
												<span className="pr-2 text-[11px]">{chain?.name}</span>
												<Token token={chainToken! as TokenType} size={16} />
											</div>
											{!!instantEscrow && (
												<div className="flex flex-row items-center mb-2">
													<span className="pr-2 text-[11px] text-gray-700">
														Instant deposit ⚡
													</span>
												</div>
											)}
											{!!(paymentTimeLimit && Number(paymentTimeLimit) > 0) && (
												<div className="flex flex-row items-center mb-2">
													<span className="pr-2 text-[11px] text-gray-700">
														Payment time limit
													</span>
													<span className="pr-2 text-[11px] text-black">
														{paymentTimeLimit} {paymentTimeLimit === 1 ? 'min' : 'mins'}
													</span>
												</div>
											)}
											<div className="mb-2">
												{banks.map((bank) => (
													<div className="flex flex-row items-center" key={bank.id}>
														<span
															className="bg-gray-500 w-1 h-3 rounded-full"
															style={{ backgroundColor: bank.color || 'gray' }}
														>
															&nbsp;
														</span>
														<span className="pl-1 text-gray-700 text-[11px]">
															{bank.name}
														</span>
													</div>
												))}
											</div>
										</div>
									</div>
									<div className="lg:hidden pb-3 pt-5">
										{isSeller ? (
											<EditListButtons list={list} />
										) : (
											<BuyButton fiatAmount={fiatAmount} tokenAmount={tokenAmount} list={list} />
										)}
									</div>
								</div>
							</td>
							<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
								<div className="flex flex-col">
									<div className="flex flex-row mb-2 space-x-2 items-center">
										<Token token={token} size={24} />
										<span>
											{Number(escrowedAmount).toFixed(2)} {symbol}
										</span>
									</div>
									<div className="flex flex-row items-center">
										<div className=" flex flex-row items-center space-x-1 bg-gray-100 px-2 rounded-full">
											<Token token={chainToken! as TokenType} size={14} />
											<span className="text-[10px]">{chain?.name}</span>
										</div>
									</div>
									{showVerification && acceptOnlyVerified && <IdVerificationNeeded />}
								</div>
							</td>
							<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
								<div className="flex flex-col">
									<div className="flex flex-row space-x-2">
										<Flag name={countries[countryCode!]} size={24} />
										<span className="flex flex-col">
											{fiatSymbol} {Number(price).toFixed(2)} per {symbol}
											{priceDifferencePercentage <= 5 && (
												<div
													className={`flex flex-row items-center justify-start space-x-1 text-${
														priceDifferencePercentage < 0 ? 'green' : 'red'
													}-500 text-xs`}
												>
													<span>
														{priceDifferencePercentage > 0 ? '+' : ''}
														{priceDifferencePercentage.toFixed(2)}%
													</span>
													<span>spot</span>
												</div>
											)}
										</span>
									</div>
								</div>
							</td>
							<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
								{(!!min || !!max) && `${fiatSymbol} ${min || 10} - ${fiatSymbol}${max || '∞'}`}
							</td>
							<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
								{!!(paymentTimeLimit && Number(paymentTimeLimit) > 0) && (
									<div className="flex flex-row items-center space-x-2">
										<ClockIcon width={16} height={16} />
										<span>
											{paymentTimeLimit} {paymentTimeLimit === 1 ? 'min' : 'mins'}
										</span>
									</div>
								)}
							</td>
							<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
								{banks.map((bank) => (
									<div className="flex flex-row items-center mb-1" key={id}>
										<span
											className="w-1 h-3 rounded-full"
											style={{ backgroundColor: bank.color || 'gray' }}
										>
											&nbsp;
										</span>
										<span className="pl-1">{bank.name}</span>
									</div>
								))}
							</td>
							<td className="hidden text-right py-4 pr-4 lg:table-cell">
								{isSeller ? (
									<EditListButtons list={list} />
								) : (
									<BuyButton fiatAmount={fiatAmount} tokenAmount={tokenAmount} list={list} />
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
