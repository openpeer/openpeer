import { verifyMessage } from 'ethers/lib/utils';
import snakecaseKeys from 'snakecase-keys';
import { useSignMessage } from 'wagmi';

interface UseCreateOrderProps {
	address: `0x${string}`;
	listId: number;
	fiatAmount: number;
	tokenAmount: number;
	price: number;
	onSuccess: (uuid: string) => void;
}

const useCreateOrder = ({ address, listId, fiatAmount, tokenAmount, price, onSuccess }: UseCreateOrderProps) => {
	const { signMessage } = useSignMessage({
		onSuccess: async (data, variables) => {
			const signingAddress = verifyMessage(variables.message, data);
			if (signingAddress === address) {
				const result = await fetch('/api/orders/', {
					method: 'POST',
					body: JSON.stringify(
						snakecaseKeys(
							{
								order: {
									listId,
									fiatAmount,
									tokenAmount,
									price
								},
								data,
								address,
								message: variables.message
							},
							{ deep: true }
						)
					)
				});
				const { uuid } = await result.json();
				if (uuid) {
					onSuccess(uuid);
					// router.push(`/orders/${uuid}`);
				}
			}
		}
	});

	return { createOrder: signMessage };
};

export default useCreateOrder;
