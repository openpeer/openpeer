import { Avatar, Button, Loading } from 'components';
import { List } from 'models/types';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

interface Prices {
	[key: string]: { [key: string]: number };
}

const HomePage = () => {
	const [lists, setLists] = useState<List[]>([]);
	const [isLoading, setLoading] = useState(false);
	const { chain, chains } = useNetwork();
	const chainId = chain?.id || chains[0]?.id;
	const { address } = useAccount();
	const [prices, setPrices] = useState<Prices>();

	useEffect(() => {
		setLoading(true);
		fetch(`/api/lists?chain_id=${chainId}`)
			.then((res) => res.json())
			.then((data) => {
				setLists(data);
				setLoading(false);
			});
	}, [chainId, address]);

	useEffect(() => {
		const fetchPrices = async () => {
			const percentageLists = lists; // .filter(({ margin_type: marginType }) => marginType === 'percentage');
			const fiats = percentageLists
				.map(({ fiat_currency: c }) => c.code.toLowerCase())
				.filter((v, i, a) => a.indexOf(v) == i);
			const tokens = percentageLists
				.map(({ token: t }) => t.coingecko_id.toLowerCase())
				.filter((v, i, a) => a.indexOf(v) == i);
			if (fiats.length > 0 && tokens.length > 0) {
				const response = await fetch(
					`https://api.coingecko.com/api/v3/simple/price?ids=${tokens.join(',')}&vs_currencies=${fiats.join(
						','
					)}`
				);

				setPrices(await response.json());
			}
		};

		fetchPrices();
	}, [lists]);

	if (isLoading) return <Loading />;
	if (!lists) return <p>No lists data</p>;

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
								const { address: sellerAddress } = seller;
								const canBuy = sellerAddress !== address;
								const apiPrice = prices ? prices[coingecko_id][code.toLowerCase()] : undefined;

								const price =
									marginType === 'fixed'
										? margin
										: apiPrice
										? apiPrice + apiPrice * (margin / 100)
										: '';
								return (
									<tr key={id} className="hover:bg-gray-50">
										<td className="pl-4 py-4">
											<div className="w-full flex flex-row justify-around md:justify-start items-center">
												<div className="w-3/5 mr-6">
													<div className="flex flex-col lg:flex-row lg:items-center">
														<div className="w-1/3 flex flex-row mb-2">
															<Avatar user={seller} />
														</div>
														<div className="text-sm text-gray-900 break-all">
															{sellerAddress}
														</div>
													</div>
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
											{(!!min || !!max) &&
												`${fiatSymbol} ${min || 10} - ${fiatSymbol}${max || '∞'}`}
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
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	const token = await getToken({ req: context.req });
	const address = token?.sub ?? null;
	// If you have a value for "address" here, your
	// server knows the user is authenticated.

	// You can then pass any data you want
	// to the page component here.
	return {
		props: {
			token,
			address,
			session,
			title: 'P2P'
		}
	};
};

type AuthenticatedPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default HomePage;
