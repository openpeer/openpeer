import { Loading, Steps } from 'components';
import { Amount, Details, PaymentMethod, Setup, Summary } from 'components/Listing';
import { UIList } from 'components/Listing/Listing.types';
import WrongNetwork from 'components/WrongNetwork';
import { useConnection } from 'hooks';
import { List } from 'models/types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

const SETUP_STEP = 1;
const AMOUNT_STEP = 2;
const PAYMENT_METHOD_STEP = 3;
const DETAILS_STEP = 4;

const DEFAULT_MARGIN_TYPE: List['margin_type'] = 'percentage';
const DEFAULT_MARGIN_VALUE = 1;

const SellPage = () => {
	const router = useRouter();
	const { token, currency, tokenAmount } = router.query;
	const quickSell = !!token && !!currency && !!Number(tokenAmount || '0');

	const { address } = useAccount();
	const { chain } = useNetwork();
	const [list, setList] = useState<UIList>({
		step: quickSell ? AMOUNT_STEP : SETUP_STEP,
		marginType: DEFAULT_MARGIN_TYPE,
		margin: DEFAULT_MARGIN_VALUE
	} as UIList);
	const step = list.step;
	const { wrongNetwork, status } = useConnection();

	useEffect(() => {
		if (list.step > 3)
			setList({
				step: PAYMENT_METHOD_STEP,
				marginType: DEFAULT_MARGIN_TYPE,
				margin: DEFAULT_MARGIN_VALUE
			} as UIList);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address]);

	useEffect(() => {
		// need to reset the AD if the chain changed because the tokens will change
		setList({ step: SETUP_STEP, marginType: DEFAULT_MARGIN_TYPE, margin: DEFAULT_MARGIN_VALUE } as UIList);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chain]);

	useEffect(() => {
		if (!!list && quickSell && step === SETUP_STEP) {
			const { currency, token, totalAvailableAmount, quickSellSetupDone } = list;

			if (!!currency && !!token && !totalAvailableAmount && !quickSellSetupDone) {
				setList({ ...list, step: AMOUNT_STEP });
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [list]);

	if (wrongNetwork) return <WrongNetwork />;
	if (status === 'loading') return <Loading />;

	return (
		<div className="py-6">
			<div className="w-full flex flex-row px-4 sm:px-6 md:px-8 mb-16">
				<div className="w-full lg:w-2/4">
					<Steps
						currentStep={step}
						stepsCount={3}
						onStepClick={(n) => setList({ ...list, ...{ step: n } })}
					/>
					{step === SETUP_STEP && (
						<Setup list={list} updateList={setList} tokenId={token} currencyId={currency} />
					)}
					{step === AMOUNT_STEP && <Amount list={list} updateList={setList} tokenAmount={tokenAmount} />}
					{step === PAYMENT_METHOD_STEP && <PaymentMethod list={list} updateList={setList} />}
					{step === DETAILS_STEP && <Details list={list} updateList={setList} />}
				</div>
				<Summary list={list} />
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
