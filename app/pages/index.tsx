import { ListsTable, Switcher } from 'components';
import { Buy, Sell } from 'components/QuickBuy';
import { List } from 'models/types';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';

import { ArrowLongLeftIcon } from '@heroicons/react/24/outline';

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
	console.log('seeLists', seeLists);
	console.log('selectedLists', selectedLists);
	console.log('showLists', showLists);
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

export const getServerSideProps: GetServerSideProps = async () => ({
	props: {
		disableAuthentication: true,
		blankLayout: true
	}
});

export default Quick;
