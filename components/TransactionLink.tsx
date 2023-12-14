import React from 'react';
import { useNetwork } from 'wagmi';

const TransactionLink = ({ hash }: { hash: `0x${string}` | undefined }) => {
	const { chain } = useNetwork();

	if (!chain || !hash) return <>Done</>;

	const {
		default: { url, name },
		etherscan
	} = chain.blockExplorers!;

	return (
		<a target="_blank" rel="noreferrer" href={`${etherscan?.url || url}/tx/${hash}`}>
			<>Done. View on {etherscan?.name || name}</>
		</a>
	);
};

export default TransactionLink;
