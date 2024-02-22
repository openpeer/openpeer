import { blast } from 'models/networks';
import React from 'react';
import { useNetwork } from 'hooks';

const TransactionLink = ({ hash }: { hash: `0x${string}` | undefined }) => {
	const { chain } = useNetwork();

	if (!chain || !hash) return <>Done</>;

	const blockExplorers = chain.id === blast.id ? blast.blockExplorers : chain.blockExplorers;

	const {
		default: { url, name },
		etherscan
	} = blockExplorers!;

	return (
		<a target="_blank" rel="noreferrer" href={`${etherscan?.url || url}/tx/${hash}`}>
			<>Done. View on {etherscan?.name || name}</>
		</a>
	);
};

export default TransactionLink;
