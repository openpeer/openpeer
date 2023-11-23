import { Button } from 'components';
import { useSignInWithTron } from 'hooks';
import React from 'react';

const TronPage = () => {
	const auth = useSignInWithTron();

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<h1 className="text-6xl font-bold">Tron</h1>
			{!auth.isAuthenticated ? (
				<Button title="Authenticate" onClick={auth.authenticateUser} />
			) : (
				<h1>Authenticated! </h1>
			)}
		</div>
	);
};

export async function getServerSideProps() {
	return {
		props: { title: 'Tron', simpleLayout: true }
	};
}
export default TronPage;
