import { Steps } from 'components';
import { Amount, Completed, Payment, Release, Summary } from 'components/Buy';
import { UIOrder } from 'components/Buy/Buy.types';
import WrongNetwork from 'components/WrongNetwork';
import { useListPrice } from 'hooks';
import { List } from 'models/types';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

const AMOUNT_STEP = 1;
const PAYMENT_METHOD_STEP = 2;
const RELEASE_STEP = 3;
const COMPLETED_STEP = 4;

const SellPage = () => {
	const { address } = useAccount();
	const { chain } = useNetwork();
	const { query } = useRouter();
	const list = JSON.parse(query.list as string) as List;
	const [order, setOrder] = useState<UIOrder>({ list, step: AMOUNT_STEP });
	const step = order.step || AMOUNT_STEP;

	const { price } = useListPrice(list);

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
					<Steps currentStep={step} onStepClick={(n) => setOrder({ ...order, ...{ step: n } })} />
					{step === AMOUNT_STEP && <Amount order={order} updateOrder={setOrder} price={price} />}
					{step === PAYMENT_METHOD_STEP && <Payment order={order} updateOrder={setOrder} />}
					{step === RELEASE_STEP && <Release order={order} updateOrder={setOrder} />}
					{step === COMPLETED_STEP && (
						<div>
							<Completed order={order} updateOrder={setOrder} />
						</div>
					)}
				</div>
				<Summary list={order.list} price={price} />
			</div>
		</div>
	);
};

export default SellPage;
