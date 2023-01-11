import { ConnectButton } from '@rainbow-me/rainbowkit';

const WrongNetwork = () => (
	<div className="flex h-screen">
		<div className="m-auto flex flex-col justify-items-center content-center text-center">
			<span className="mb-6 text-xl">Connect to Polygon</span>
			<span className="mb-6 text-gray-500 text-xl">Access the OpenPeer using your favorite wallet</span>
			<span className="mb-4 m-auto">
				<ConnectButton showBalance={false} />
			</span>
		</div>
	</div>
);

export default WrongNetwork;
