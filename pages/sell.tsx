import { Button, Loading, Steps } from 'components';
import { Amount, Details, ListType, PaymentMethod, Setup, Summary } from 'components/Listing';
import { UIList } from 'components/Listing/Listing.types';
import React, { useEffect, useState } from 'react';
import { useAccount } from 'hooks';

import { AdjustmentsVerticalIcon } from '@heroicons/react/24/solid';
import {
	DEFAULT_DEPOSIT_TIME_LIMIT,
	DEFAULT_ESCROW_TYPE,
	DEFAULT_MARGIN_TYPE,
	DEFAULT_MARGIN_VALUE,
	DEFAULT_PAYMENT_TIME_LIMIT
} from 'utils';

const LIST_TYPE_STEP = 1;
const SETUP_STEP = 2;
const AMOUNT_STEP = 3;
const PAYMENT_METHOD_STEP = 4;
const DETAILS_STEP = 5;

const defaultList = {
	marginType: DEFAULT_MARGIN_TYPE,
	margin: DEFAULT_MARGIN_VALUE,
	depositTimeLimit: DEFAULT_DEPOSIT_TIME_LIMIT,
	paymentTimeLimit: DEFAULT_PAYMENT_TIME_LIMIT,
	escrowType: DEFAULT_ESCROW_TYPE
};

const SellPage = () => {
	const [merchants, setMerchants] = useState<`0x${string}`[] | undefined>();
	const [showFilters, setShowFilters] = useState(false);

	const { address } = useAccount();
	const [list, setList] = useState<UIList>({
		...{
			step: LIST_TYPE_STEP,
			type: 'SellList'
		},
		...defaultList
	} as UIList);
	const { step } = list;

	useEffect(() => {
		const fetchMerchants = async () => {
			const res = await fetch('/api/merchants');
			setMerchants(await res.json());
		};

		fetchMerchants();
	}, []);

	useEffect(() => {
		if (list.step > 4) {
			setList({ ...{ step: PAYMENT_METHOD_STEP }, ...defaultList } as UIList);
		}
	}, [address]);

	useEffect(() => {
		if (list.paymentMethods?.length > 0) {
			setList({ ...list, ...{ paymentMethods: [] } });
		}

		if (list.bankIds?.length > 0) {
			setList({ ...list, ...{ bankIds: [] } });
		}
	}, [list.type]);

	const handleToggleFilters = () => {
		setShowFilters(!showFilters);
	};

	if (merchants === undefined) return <Loading message="Loading..." />;

	if (address && !merchants.map((m) => m.toLowerCase()).includes(address.toLowerCase())) {
		return (
			<Loading
				spinner={false}
				message={
					<a
						className="flex flex-col items-center space-y-2"
						href="https://forms.gle/qiAzsPeCphUhZgBM9"
						target="_blank"
						rel="noreferrer"
					>
						<div>You need to be a verified merchant to post an ad on OpenPeer.</div>
						<div>
							<Button title="Apply here!" />
						</div>
					</a>
				}
			/>
		);
	}

	return (
		<div className="pt-4 md:pt-6">
			<div className="w-full flex flex-col md:flex-row px-4 sm:px-6 md:px-8 mb-16">
				<div className="w-full lg:w-2/4">
					<Steps
						currentStep={step}
						stepsCount={4}
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
					{step === LIST_TYPE_STEP && <ListType list={list} updateList={setList} />}
					{step === SETUP_STEP && <Setup list={list} updateList={setList} />}
					{step === AMOUNT_STEP && <Amount list={list} updateList={setList} />}
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
