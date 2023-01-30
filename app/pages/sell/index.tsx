import { Loading, Steps } from 'components';
import { Amount, Details, PaymentMethod, Setup, Summary, UpdateEmail } from 'components/Listing';
import { UIList } from 'components/Listing/Listing.types';
import WrongNetwork from 'components/WrongNetwork';
import { useConnection } from 'hooks';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

const SETUP_STEP = 1;
const AMOUNT_STEP = 2;
const PAYMENT_METHOD_STEP = 3;
const DETAILS_STEP = 4;
const UPDATE_EMAIL_STEP = 5;

const SellPage = () => {
	const { address } = useAccount();
	const { chain } = useNetwork();
	const [list, setList] = useState<UIList>({
		step: SETUP_STEP,
		marginType: 'fixed'
	} as UIList);
	const step = list.step;
	const { wrongNetwork, status } = useConnection();

	useEffect(() => {
		if (list.step > 3) setList({ step: PAYMENT_METHOD_STEP, marginType: 'fixed' } as UIList);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address, chain]);

	if (wrongNetwork) return <WrongNetwork />;
	if (status === 'loading') return <Loading />;

	return (
		<div className="py-6">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mb-16">
				<h1 className="text-2xl font-semibold text-gray-900">Crypto Listing » Sell Order</h1>
			</div>
			<div className="w-full flex flex-row px-4 sm:px-6 md:px-8 mb-16">
				<div className="w-full lg:w-2/4">
					<Steps
						currentStep={step}
						onStepClick={(n) => step < UPDATE_EMAIL_STEP && setList({ ...list, ...{ step: n } })}
					/>
					{step === SETUP_STEP && <Setup list={list} updateList={setList} />}
					{step === AMOUNT_STEP && <Amount list={list} updateList={setList} />}
					{step === PAYMENT_METHOD_STEP && <PaymentMethod list={list} updateList={setList} />}
					{step === DETAILS_STEP && <Details list={list} updateList={setList} />}
					{step === UPDATE_EMAIL_STEP && <UpdateEmail list={list} updateList={setList} />}
				</div>
				<Summary list={list} />
			</div>
		</div>
	);
};

export default SellPage;
