import { allChains } from 'models/networks';
import React from 'react';
import { useSwitchNetwork } from 'wagmi';

import Button from './Button/Button';

const WrongNetwork = ({ desiredChainId }: { desiredChainId: number }) => {
	const { switchNetwork } = useSwitchNetwork();
	let chainName = '';
	if (desiredChainId) {
		const chain = allChains.find((c) => c.id === desiredChainId);
		if (chain?.name) {
			chainName = chain.name;
		}
	}
	return (
		<div className="flex h-screen">
			<div className="px-6 m-auto flex flex-col justify-items-center content-center text-center">
				<span className="mb-6 text-xl">Looks like you are connected to the wrong network</span>
				<span className="mb-4 m-auto">
					<Button title={`Switch to ${chainName}`} onClick={() => switchNetwork?.(desiredChainId)} />
				</span>
			</div>
		</div>
	);
};

export default WrongNetwork;
