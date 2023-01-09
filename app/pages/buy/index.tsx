import { Steps } from 'components';
import { Amount, Completed, Payment, Release, Summary } from 'components/Buy';
import { UIList } from 'components/Listing/Listing.types';
import WrongNetwork from 'components/WrongNetwork';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

const AMOUNT_STEP = 1;
const PAYMENT_METHOD_STEP = 2;
const RELEASE_STEP = 3;
const COMPLETED_STEP = 4;

const SellPage = () => {
	const { address } = useAccount();
	const { chain } = useNetwork();
	const [list, setList] = useState<UIList>({
		step: AMOUNT_STEP,
		marginType: 'fixed'
	} as UIList);
	const step = list.step;

	useEffect(() => {
		if (list.step > 2) setList({ step: PAYMENT_METHOD_STEP, marginType: 'fixed' } as UIList);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address, chain]);

	if (!address || !chain || chain.unsupported) {
		return <WrongNetwork />;
	}

	return (
		<div className="pt-6">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mb-8">
				<h1 className="text-2xl font-semibold text-gray-900">Buy</h1>
			</div>
			<div className="w-full flex flex-row px-4 sm:px-6 md:px-8 mb-16">
				<div className="w-full lg:w-2/4">
					<Steps currentStep={step} onStepClick={(n) => setList({ ...list, ...{ step: n } })} />
					{step === AMOUNT_STEP && <Amount list={list} updateList={setList} />}
					{step === PAYMENT_METHOD_STEP && <Payment list={list} updateList={setList} />}
					{step === RELEASE_STEP && <Release list={list} updateList={setList} />}
					{step === COMPLETED_STEP && (
						<div>
							<Completed list={list} updateList={setList} />
						</div>
					)}
				</div>
				<Summary />
			</div>
		</div>
	);
};

export default SellPage;
