import { Loading, Steps } from 'components';
import { Amount, Completed, Payment, Release, Summary } from 'components/Buy';
import { UIOrder } from 'components/Buy/Buy.types';
import WrongNetwork from 'components/WrongNetwork';
import { useListPrice } from 'hooks';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

const AMOUNT_STEP = 1;
const PAYMENT_METHOD_STEP = 2;
const RELEASE_STEP = 3;
const COMPLETED_STEP = 4;

const SellPage = ({ id }: { id: number }) => {
	const { address } = useAccount();
	const { chain } = useNetwork();
	const [order, setOrder] = useState<UIOrder>({ step: AMOUNT_STEP });
	const { step = AMOUNT_STEP, list } = order;
	const { price } = useListPrice(list);

	useEffect(() => {
		fetch(`/api/lists/${id}`)
			.then((res) => res.json())
			.then((data) => {
				setOrder({ ...order, ...{ list: data } });
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	if (!list) {
		return <Loading />;
	}

	if (!address || !chain || chain.unsupported) {
		return <WrongNetwork />;
	}

	return (
		<div className="pt-6">
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
				{!!order.list && <Summary list={order.list} price={price} />}
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => {
	// Pass data to the page via props
	return { props: { title: 'Buy', id: String(context.params?.id) } };
};
export default SellPage;
