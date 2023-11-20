import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { Button } from 'components';
import React from 'react';
import TronWeb from 'tronweb';

const TronPage = () => {
	const { connected, wallet, signMessage } = useWallet();

	const signIn = async () => {
		if (!wallet) return;

		const tronWeb = new TronWeb({
			// fullHost: 'https://api.nileex.io'
			fullHost: 'https://api.trongrid.io'
		});

		const signature = await signMessage('message');
		console.log(tronWeb.trx);
		const address = await tronWeb.trx.verifyMessageV2('message', signature);
		console.log(signature, address);

		// const address = await tronWeb.trx.verifyMessageV2('message', signature);
		// console.log(address);
	};
	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1 className="text-6xl font-bold">Tron</h1>
			{connected && <Button title="Sign" onClick={signIn} />}
		</div>
	);
};

export async function getServerSideProps() {
	return {
		props: { title: 'Tron', simpleLayout: true, disableAuthentication: true, tron: true }
	};
}
export default TronPage;
