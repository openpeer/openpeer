import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { Button } from 'components';
import React from 'react';

const TronPage = () => {
	const { connected, signMessage } = useWallet();

	const signIn = async () => {
		const signature = await signMessage('Marcos Teixeira');

		console.log(signature);
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
