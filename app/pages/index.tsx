import { ListsTable, Switcher } from 'components';
import { Buy, Sell } from 'components/QuickBuy';
import { List } from 'models/types';
import React, { useState } from 'react';

import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type QuickBuyType = 'Buy' | 'Sell';

const Quick = () => {
	const [buyLists, setBuyLists] = useState<List[]>([]);
	const [sellLists, setSellLists] = useState<List[]>([]);
	const [seeLists, setSeeLists] = useState(false);
	const [type, setType] = useState<QuickBuyType>('Buy');
	const [loading, setLoading] = useState(false);
	const [buyFiatAmount, setBuyFiatAmount] = useState<number>();
	const [buyTokenAmount, setBuyTokenAmount] = useState<number>();

	const onBuySellClick = (fiatAmount: number | undefined, tokenAmount: number) => {
		setBuyFiatAmount(fiatAmount);
		setBuyTokenAmount(tokenAmount);
		setSeeLists(true);
	};

	const selectedLists = type === 'Buy' ? buyLists : sellLists;
	const showLists = selectedLists.length > 0 && seeLists && (type === 'Sell' || !!buyFiatAmount) && !!buyTokenAmount;
	return (
		<>
			{showLists && (
				<div className="py-6">
					<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
						<div className="flex">
							<div
								className="flex flex-row items-center cursor-pointer"
								onClick={() => setSeeLists(false)}
							>
								<ArrowLongLeftIcon width={24} />
								<span className="pl-2">{type}</span>
							</div>
						</div>
						<div className="py-4">
							<ListsTable lists={selectedLists} fiatAmount={buyFiatAmount} tokenAmount={buyTokenAmount} />
						</div>
					</div>
				</div>
			)}
			<div className={`flex flex-col justify-center sm:py-12 sm:px-6 lg:px-8 ${showLists ? 'hidden' : ''}`}>
				<Link
					href="/airdrop"
					className="flex w-full text-center md:hidden hover:animate-pulse drop-shadow-md pt-6 px-4"
				>
					<span className="w-full px-16 py-3 bg-gradient-to-r from-[#2C76E5] via-[#955AFF] to-[#6FD9EC] rounded-lg text-white text-base font-bold">
						Rewards
					</span>
				</Link>
				<div className="mt-8 mx-4 sm:mx-auto sm:w-full sm:max-w-md">
					<div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
						<div className="space-y-6">
							<div className="flex flex-row items-center justify-between">
								<h1 className="text-2xl font-bold">{type} Crypto</h1>
								<Switcher
									leftLabel="Buy"
									rightLabel="Sell"
									selected={type}
									onToggle={(t) => setType(t as QuickBuyType)}
								/>
							</div>
							<div className={`${loading ? 'animate-pulse' : ''}`}>
								<div className={`${type === 'Sell' ? 'hidden' : ''}`}>
									<Buy
										lists={buyLists}
										updateLists={setBuyLists}
										onSeeOptions={onBuySellClick}
										onLoading={setLoading}
									/>
								</div>

								<div className={`${type === 'Buy' ? 'hidden' : ''}`}>
									<Sell
										lists={sellLists}
										updateLists={setSellLists}
										onLoading={setLoading}
										onSeeOptions={onBuySellClick}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

Quick.getInitialProps = async () => ({ disableAuthentication: true });

export default Quick;
