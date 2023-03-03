import { ListsTable, Loading } from 'components';
import { List } from 'models/types';
import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

const HomePage = () => {
	const [lists, setLists] = useState<List[]>([]);
	const [isLoading, setLoading] = useState(false);
	const { chain, chains } = useNetwork();
	const chainId = chain?.id || chains[0]?.id;
	const { address } = useAccount();

	useEffect(() => {
		setLoading(true);
		fetch(`/api/lists?chain_id=${chainId}`)
			.then((res) => res.json())
			.then((data) => {
				setLists(data);
				setLoading(false);
			});
	}, [chainId, address]);

	if (isLoading) return <Loading />;
	if (!lists) return <p>No lists data</p>;

	return (
		<div className="py-6">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
				<div className="py-4">
					<ListsTable lists={lists} />
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);
	const token = await getToken({ req: context.req });
	const address = token?.sub ?? null;
	// If you have a value for "address" here, your
	// server knows the user is authenticated.

	// You can then pass any data you want
	// to the page component here.
	return {
		props: {
			token,
			address,
			session,
			title: 'P2P'
		}
	};
};

export default HomePage;
