import { Loading, Steps } from 'components';
import { Completed, Payment, Release, Summary } from 'components/Buy';
import { UIOrder } from 'components/Buy/Buy.types';
import WrongNetwork from 'components/WrongNetwork';
import { useConnection } from 'hooks';
import useCable from 'hooks/useCable';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const PAYMENT_METHOD_STEP = 2;
const RELEASE_STEP = 3;
const COMPLETED_STEP = 4;

const steps: { [key: string]: number } = {
	created: PAYMENT_METHOD_STEP,
	escrowed: PAYMENT_METHOD_STEP,
	release: RELEASE_STEP,
	cancelled: COMPLETED_STEP,
	dispute: COMPLETED_STEP,
	closed: COMPLETED_STEP
};

const OrderPage = ({ id }: { id: `0x${string}` }) => {
	const [order, setOrder] = useState<UIOrder>();
	const { wrongNetwork, status } = useConnection();
	const { data: session } = useSession();
	// @ts-ignore
	const { jwt } = session || {};

	useEffect(() => {
		fetch(`/api/orders/${id}`)
			.then((res) => res.json())
			.then((data) => {
				setOrder({ ...data, ...{ step: steps[data.status] } });
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	useEffect(() => {
		const setupChannel = async () => {
			if (!jwt) return;
			const { createConsumer } = await import('@rails/actioncable');

			const consumer = createConsumer(`${process.env.NEXT_PUBLIC_API_WS_URL}/cable?token=${jwt}`);
			consumer.subscriptions.create(
				{
					channel: 'OrdersChannel',
					order_id: id
				},
				{
					received(data: string) {
						const updatedOrder = JSON.parse(data);
						setOrder({ ...order, ...updatedOrder });
					}
				}
			);
		};

		setupChannel();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [jwt]);

	if (wrongNetwork) return <WrongNetwork />;
	if (status === 'loading' || !order) return <Loading />;

	const { step, list } = order;
	return (
		<div className="pt-6">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mb-8">
				<h1 className="text-2xl font-semibold text-gray-900">Buy</h1>
			</div>
			<div className="w-full flex flex-row px-4 sm:px-6 md:px-8 mb-16">
				<div className="w-full lg:w-2/4">
					<Steps currentStep={step} stepsCount={3} />
					{step === PAYMENT_METHOD_STEP && <Payment order={order} updateOrder={setOrder} />}
					{step === RELEASE_STEP && <Release order={order} updateOrder={setOrder} />}
					{step === COMPLETED_STEP && <Completed order={order} updateOrder={setOrder} />}
				</div>
				{!!list && <Summary order={order} />}
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => {
	// Pass data to the page via props
	return { props: { id: String(context.params?.id) } };
};
export default OrderPage;
