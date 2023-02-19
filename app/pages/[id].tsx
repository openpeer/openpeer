import { HeaderMetrics, ListsTable, Loading } from 'components';
import { List, User } from 'models/types';
import { GetServerSideProps } from 'next';
import ErrorPage from 'next/error';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

const Profile = ({ id }: { id: number }) => {
	const [user, setUser] = useState<User | null>();
	const [lists, setLists] = useState<List[]>([]);
	const { chain, chains } = useNetwork();
	const chainId = chain?.id || chains[0]?.id;

	useEffect(() => {
		fetch(`/api/users/${id}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.errors) {
					setUser(null);
				} else {
					setUser(data);
				}
			});
	}, [id]);

	useEffect(() => {
		if (!user) return;

		fetch(`/api/lists?chain_id=${chainId}&seller=${user.address}`)
			.then((res) => res.json())
			.then((data) => {
				setLists(data);
			});
	}, [user, chainId]);

	if (user === undefined) {
		return <Loading />;
	}
	if (user === null) {
		return <ErrorPage statusCode={404} />;
	}

	return (
		<>
			<HeaderMetrics user={user} />
			{!!user && lists && lists.length > 0 && (
				<div className="flex px-6">
					<div className="w-full md:w-5/6 m-auto">
						<ListsTable address={user.address} lists={lists} />
					</div>
				</div>
			)}
		</>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => {
	return {
		props: { title: 'Profile', id: String(context.params?.id) } // will be passed to the page component as props
	};
};

export default Profile;
