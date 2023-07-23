import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import { Loading, Steps } from 'components';
import { Amount, Details, PaymentMethod, Setup, Summary } from 'components/Listing';
import { UIList } from 'components/Listing/Listing.types';
import WrongNetwork from 'components/WrongNetwork';
import { useConnection } from 'hooks';
import { List } from 'models/types';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

const SETUP_STEP = 1;
const AMOUNT_STEP = 2;
const PAYMENT_METHOD_STEP = 3;
const DETAILS_STEP = 4;

const DEFAULT_MARGIN_TYPE: List['margin_type'] = 'percentage';
const DEFAULT_MARGIN_VALUE = 1;
const DEFAULT_DEPOSIT_TIME_LIMIT = 60;

const defaultList = {
	marginType: DEFAULT_MARGIN_TYPE,
	margin: DEFAULT_MARGIN_VALUE,
	depositTimeLimit: DEFAULT_DEPOSIT_TIME_LIMIT
};

const SellPage = () => {
	const router = useRouter();
	const [showFilters, setShowFilters] = useState(false);
	const { token, currency, tokenAmount, fiatAmount } = router.query;
	const quickBuy = !!token && !!currency && !!Number(fiatAmount || '0');
	const quickSell = !!token && !!currency && !!Number(tokenAmount || '0');

	const { address } = useAccount();
	const { chain } = useNetwork();
	const [list, setList] = useState<UIList>({
		...{
			step: quickSell || quickBuy ? AMOUNT_STEP : SETUP_STEP,
			type: quickSell || quickBuy ? (quickBuy ? 'SellList' : 'BuyList') : undefined
		},
		...defaultList
	} as UIList);
	const { step } = list;
	const { wrongNetwork, status } = useConnection();

	useEffect(() => {
		if (list.step > 3) {
			setList({ ...{ step: PAYMENT_METHOD_STEP }, ...defaultList } as UIList);
		}
	}, [address]);

	useEffect(() => {
		// need to reset the AD if the chain changed because the tokens will change
		setList({
			...{ step: SETUP_STEP, type: quickSell || quickBuy ? (quickBuy ? 'SellList' : 'BuyList') : undefined },
			...defaultList
		} as UIList);
	}, [chain]);

	useEffect(() => {
		if (!!list && (quickSell || quickBuy) && step === SETUP_STEP) {
			const { totalAvailableAmount, quickSellSetupDone } = list;

			if (!!list.currency && !!list.token && !totalAvailableAmount && !quickSellSetupDone) {
				setList({ ...list, type: quickSell ? 'SellList' : 'BuyList', step: AMOUNT_STEP });
			}
		}
	}, [list]);

	if (wrongNetwork) return <WrongNetwork />;
	if (status === 'loading') return <Loading />;

	const handleToggleFilters = () => {
		setShowFilters(!showFilters);
	};

	return (
		<div className="pt-4 md:pt-6">
			<div className="w-full flex flex-col md:flex-row px-4 sm:px-6 md:px-8 mb-16">
				<div className="w-full lg:w-2/4">
					<Steps
						currentStep={step}
						stepsCount={3}
						onStepClick={(n) => setList({ ...list, ...{ step: n } })}
					/>
					<div className="flex flex-row justify-end md:hidden md:justify-end" onClick={handleToggleFilters}>
						<AdjustmentsVerticalIcon
							width={24}
							height={24}
							className="text-gray-600 hover:cursor-pointer"
						/>
						<span className="text-gray-600 hover:cursor-pointer ml-2">Details</span>
					</div>
					{showFilters && (
						<div className="mt-4 md:hidden">
							<Summary list={list} />
						</div>
					)}
					{step === SETUP_STEP && (
						<Setup list={list} updateList={setList} tokenId={token} currencyId={currency} />
					)}
					{step === AMOUNT_STEP && <Amount list={list} updateList={setList} tokenAmount={tokenAmount} />}
					{step === PAYMENT_METHOD_STEP && <PaymentMethod list={list} updateList={setList} />}
					{step === DETAILS_STEP && <Details list={list} updateList={setList} />}
				</div>
				<div className="hidden lg:contents">
					<Summary list={list} />
				</div>
			</div>
		</div>
	);
};

export async function getServerSideProps() {
	return {
		props: { title: 'Post Ad' } // will be passed to the page component as props
	};
}

export default SellPage;
