import { Loading, Steps, WrongNetwork } from 'components';
import { Cancelled, Completed, Payment, Release, Summary } from 'components/Buy';
import { UIOrder } from 'components/Buy/Buy.types';
import Dispute from 'components/Dispute/Dispute';
import jwt from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { siweServer } from 'utils/siweServer';
import { useNetwork } from 'wagmi';

const ERROR_STEP = 0;
const PAYMENT_METHOD_STEP = 2;
const RELEASE_STEP = 3;
const COMPLETED_STEP = 4;
const CANCELLED_STEP = 5;

const steps: { [key: string]: number } = {
	created: PAYMENT_METHOD_STEP,
	escrowed: PAYMENT_METHOD_STEP,
	release: RELEASE_STEP,
	cancelled: CANCELLED_STEP,
	closed: COMPLETED_STEP,
	dispute: COMPLETED_STEP,
	error: ERROR_STEP
};

const OrderPage = ({ id, token }: { id: `0x${string}`; token: string }) => {
	const [order, setOrder] = useState<UIOrder>();
	const { chain } = useNetwork();

	useEffect(() => {
		fetch(`/api/orders/${id}`)
			.then((res) => res.json())
			.then((data) => {
				setOrder({ ...data, ...{ step: steps[data.status || 'error'] } });
			});
	}, [id, token]);

	useEffect(() => {
		const setupChannel = async () => {
			if (!token) return;
			const { createConsumer } = await import('@rails/actioncable');

			const consumer = createConsumer(`${process.env.NEXT_PUBLIC_API_WS_URL}/cable?token=${token}`);
			consumer.subscriptions.create(
				{
					channel: 'OrdersChannel',
					order_id: id
				},
				{
					received(response: string) {
						const { data: updatedOrder } = JSON.parse(response);
						console.log('updatedOrder', updatedOrder);
						setOrder({ ...updatedOrder, ...{ step: steps[updatedOrder.status] } });
					}
				}
			);
		};

		setupChannel();
	}, [token]);

	if (order?.list?.chain_id && chain && order.list.chain_id !== chain.id) {
		return <WrongNetwork desiredChainId={order?.list.chain_id} />;
	}

	if (!order) return <Loading />;

	const { step, list, dispute } = order;

	if (!!dispute || order.status === 'dispute') {
		return <Dispute order={order} />;
	}

	return (
		<div className="pt-4 md:pt-6">
			<div className="w-full flex flex-row px-4 sm:px-6 md:px-8 mb-16">
				<div className="w-full lg:w-2/4">
					<Steps currentStep={step} stepsCount={3} />
					{step === PAYMENT_METHOD_STEP && <Payment order={order} updateOrder={setOrder} />}
					{step === RELEASE_STEP && <Release order={order} updateOrder={setOrder} />}
					{step === COMPLETED_STEP && <Completed order={order} updateOrder={setOrder} />}
					{step === CANCELLED_STEP && <Cancelled order={order} updateOrder={setOrder} />}
					{step === ERROR_STEP && <p>We could not find this order</p>}
				</div>
				{!!list && <Summary order={order} />}
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async ({ req, res, params }) => {
	const { address } = await siweServer.getSession(req, res);
	const encodedToken = jwt.sign(
		{ sub: address, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
		process.env.NEXTAUTH_SECRET!,
		{
			algorithm: 'HS256'
		}
	);
	return { props: { title: 'Buy', id: String(params?.id), token: encodedToken } };
};
export default OrderPage;
