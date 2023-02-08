// const consumer = createConsumer(`${process.env.NEXT_PUBLIC_API_WS_URL}/cable?token=${session?.token}`);
import { useSession } from 'next-auth/react';

const useCable = async () => {
	const { data: session } = useSession();
	//@ts-ignore
	const jwt = session?.jwt;
	const initTerminal = async () => {
		const { createConsumer } = await import('@rails/actioncable');

		if (!jwt) return;
		const consumer = createConsumer(`${process.env.NEXT_PUBLIC_API_WS_URL}/cable?token=${jwt}`);
		consumer.subscriptions.create(
			{
				channel: 'OrdersChannel'
			},
			{
				connected() {
					console.log('OrdersChannel connected');
				},
				received(data) {
					console.log('NEW NOTIFICATION: ', data);
				}
			}
		);
		return consumer;
	};

	return initTerminal();
};

export default useCable;
