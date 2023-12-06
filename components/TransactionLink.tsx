import React from 'react';
import { useNetwork } from 'hooks';

const TransactionLink = ({ hash }: { hash: `0x${string}` | undefined }) => {
	const { chain } = useNetwork();

	if (!chain || !hash) return <>Done</>;

	const {
		default: { url, name },
		etherscan: { url: etherscanUrl, name: etherscanName }
	} = chain.blockExplorers!;

	return (
		<a target="_blank" rel="noreferrer" href={`${etherscanUrl || url}/tx/${hash}`}>
			<>Done. View on {etherscanName || name}</>
		</a>
	);
};

export default TransactionLink;
