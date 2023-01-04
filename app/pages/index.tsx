import { Loading } from 'components';
import Avatar from 'components/Avatar';
import HeaderMetrics from 'components/MerchantAccount/HeaderMetrics';
import { formatUnits } from 'ethers/lib/utils.js';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

import Button from '../components/Button/Button';
import { List } from '../models/types';

const HomePage = () => {
	const [lists, setLists] = useState<List[]>([]);
	const [isLoading, setLoading] = useState(false);
	const { chain, chains } = useNetwork();
	const chainId = chain?.id || chains[0]?.id;
	useEffect(() => {
		setLoading(true);
		fetch(`/api/lists?chain_id=${chainId}`)
			.then((res) => res.json())
			.then((data) => {
				setLists(data);
				setLoading(false);
			});
	}, [chainId]);

	if (isLoading) return <Loading />;
	if (!lists) return <p>No lists data</p>;

	return (
		<div className="py-6">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
				{/* <HeaderMetrics /> */}
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
									Volume
								</th>
								<th
									scope="col"
									className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
								>
									Amount
								</th>
								<th
									scope="col"
									className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
								>
									Limit
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
							{lists.map(
								({
									id,
									total_available_amount: amount,
									seller: { address },
									token: { decimals, symbol },
									fiat_currency: { symbol: fiatSymbol },
									limit_min: min,
									limit_max: max
								}) => (
									<tr key={id} className="hover:bg-gray-50">
										<td className="pl-4 py-4">
											<div className="w-full flex flex-row justify-around md:justify-start items-center">
												<div className="w-3/5 mr-6">
													<div className="flex flex-col lg:flex-row lg:items-center">
														<div className="w-1/3 flex flex-row mb-2">
															<Avatar
																image={
																	'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80'
																}
															/>
														</div>
														<div className="text-sm text-gray-900 break-all">{address}</div>
													</div>
													<div className="mt-1 flex flex-col text-gray-500 block lg:hidden">
														<span>Volume: 0.0212 BTC</span>
													</div>
												</div>
												<div className="w-2/5 flex flex-col lg:hidden px-4">
													<span className="font-bold mb-2">
														{formatUnits(amount, decimals)} {symbol}
													</span>
													<Button title="Buy" />
												</div>
											</div>
										</td>
										<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
											0.0212 BTC
										</td>
										<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
											{formatUnits(amount, decimals)} {symbol}
										</td>
										<td className="hidden px-3.5 py-3.5 text-sm text-gray-500 lg:table-cell">
											{(!!min || !!max) &&
												`${fiatSymbol} ${min || 10} - ${fiatSymbol}${max || '∞'}`}
										</td>
										<td className="hidden text-right py-4 pr-4 lg:table-cell">
											<Button title="Buy" />
										</td>
									</tr>
								)
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export async function getServerSideProps() {
	return {
		props: { title: 'P2P' } // will be passed to the page component as props
	};
}

export default HomePage;
