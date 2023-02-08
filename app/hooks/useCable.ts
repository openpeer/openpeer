import { useSession } from 'next-auth/react';

interface UseCableParameters {
	uuid: `0x${string}`;
	onReceived: (data: any) => void;
}

const useCable = async ({ uuid, onReceived }: UseCableParameters) => {
	const { data: session } = useSession();
	//@ts-ignore
	const jwt = session?.jwt;
	const initTerminal = async () => {
		const { createConsumer } = await import('@rails/actioncable');

		if (!jwt) return;
		const consumer = createConsumer(`${process.env.NEXT_PUBLIC_API_WS_URL}/cable?token=${jwt}`);
		return consumer;
	};

	return initTerminal();
};

export default useCable;
