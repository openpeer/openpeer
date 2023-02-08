import { Button } from 'components';
import { toBn } from 'evm-bn';
import { useCreateContract } from 'hooks';
import { Token } from 'models/types';
import { useAccount } from 'wagmi';

interface EscrowFundsButtonParams {
	uuid: `0x${string}`;
	buyer: `0x${string}`;
	token: Token;
	tokenAmount: number;
}

const EscrowFundsButton = ({ uuid, buyer, token, tokenAmount }: EscrowFundsButtonParams) => {
	const { isConnected } = useAccount();

	const { isLoading, isSuccess, data, createContract } = useCreateContract({
		orderID: uuid!,
		buyer,
		amount: toBn(String(tokenAmount), token.decimals)
	});

	const escrow = () => {
		if (!isConnected) return;
		createContract?.();
	};

	return (
		<span className="w-full">
			<Button title="Escrow funds" onClick={escrow} />
		</span>
	);
};

export default EscrowFundsButton;
