import React from 'react';
import { polygon, polygonMumbai } from 'wagmi/chains';

import { ConnectButton } from '@rainbow-me/rainbowkit';

const WrongNetwork = ({ desiredChainId }: { desiredChainId?: number }) => {
	let chainName = 'Polygon';
	if (desiredChainId) {
		// @TODO: change to the chains helper
		const chain = [polygon, polygonMumbai].find((c) => c.id === desiredChainId);
		if (chain?.name) {
			chainName = chain.name;
		}
	}
	return (
		<div className="flex h-screen">
			<div className="px-6 m-auto flex flex-col justify-items-center content-center text-center">
				<span className="mb-6 text-xl">Connect to {chainName}</span>
				<span className="mb-6 text-gray-500 text-xl">Access the OpenPeer using your favorite wallet</span>
				<span className="mb-4 m-auto">
					<ConnectButton showBalance={false} />
				</span>
			</div>
		</div>
	);
};

export default WrongNetwork;
