import { devChains } from 'models/networks';
import React from 'react';

import { ConnectButton } from '@rainbow-me/rainbowkit';

const WrongNetwork = ({ desiredChainId }: { desiredChainId?: number }) => {
	let chainName = '';
	if (desiredChainId) {
		const chain = devChains.find((c) => c.id === desiredChainId);
		if (chain?.name) {
			chainName = chain.name;
		}
	}
	return (
		<div className="flex h-screen">
			<div className="px-6 m-auto flex flex-col justify-items-center content-center text-center">
				<span className="mb-6 text-xl">Connect {chainName ? `to ${chainName}` : 'your wallet'}</span>
				<span className="mb-6 text-gray-500 text-xl">Access the OpenPeer using your favorite wallet</span>
				<span className="mb-4 m-auto">
					<ConnectButton showBalance={false} />
				</span>
			</div>
		</div>
	);
};

export default WrongNetwork;
