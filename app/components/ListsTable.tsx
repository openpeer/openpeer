import { useListsPrices } from 'hooks';
import { List } from 'models/types';
import Link from 'next/link';
import { smallWalletAddress } from 'utils';
import { useAccount } from 'wagmi';

import Avatar from './Avatar';
import Button from './Button/Button';

interface ListsTableParams {
	lists: List[];
}

const ListsTable = ({ lists }: ListsTableParams) => {
	const prices = useListsPrices(lists);
	const { address } = useAccount();

	return (
		<table className="w-full md:rounded-lg overflow-hidden">
			<thead className="bg-gray-100">
				<tr className="w-full relative">
					<th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
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
						&nbsp;
					</th>
				</tr>
			</thead>
			<tbody className="divide-y divide-gray-200 bg-white">
				{lists.map((list) => {
					const {
						id,
						total_available_amount: amount,
						seller,
						token: { symbol, coingecko_id },
						fiat_currency: { symbol: fiatSymbol, code },
						limit_min: min,
						limit_max: max,
						margin_type: marginType,
						margin
					} = list;
					const { address: sellerAddress, name } = seller;
					const canBuy = sellerAddress !== address;
					const apiPrice =
						marginType === 'percentage' && prices ? prices[coingecko_id][code.toLowerCase()] : undefined;

					const price =
						marginType === 'fixed' ? margin : apiPrice ? apiPrice + apiPrice * (margin / 100) : '';
					return (
						<tr key={id} className="hover:bg-gray-50">
							<td className="pl-4 py-4">
								<div className="w-full flex flex-row justify-around md:justify-start items-center">
									<div className="w-3/5 mr-6">
										<Link href={`/${sellerAddress}`}>
											<div className="flex flex-col lg:flex-row lg:items-center cursor-pointer">
												<div className="w-1/3 flex flex-row mb-2">
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
									<div className="w-2/5 flex flex-col lg:hidden px-4">
										<span className="font-bold mb-2">
											{fiatSymbol} {price} per {symbol}
										</span>
										{canBuy && (
											<Link href={`/buy/${encodeURIComponent(list.id)}`}>
												<Button title="Buy" />
											</Link>
										)}
									</div>
								</div>
							</td>
							<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
								{amount} {symbol}
							</td>
							<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
								{fiatSymbol} {price} per {symbol}
							</td>
							<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
								{(!!min || !!max) && `${fiatSymbol} ${min || 10} - ${fiatSymbol}${max || '∞'}`}
							</td>
							<td className="hidden text-right py-4 pr-4 lg:table-cell">
								{canBuy && (
									<Link href={`/buy/${encodeURIComponent(list.id)}`}>
										<Button title="Buy" />
									</Link>
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
