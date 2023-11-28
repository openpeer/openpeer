import { HeaderMetrics, Label, ListsTable, Loading } from 'components';
import NotificationHeader from 'components/Notifications/NotificationHeader';
import { List, User } from 'models/types';
import { GetServerSideProps } from 'next';
import ErrorPage from 'next/error';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import useAccount from 'hooks/useAccount';

const Profile = ({ id }: { id: number }) => {
	const [user, setUser] = useState<User | null>();
	const [lists, setLists] = useState<List[]>([]);
	const { address } = useAccount();
	const router = useRouter();
	const { verification } = router.query;

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

		fetch(`/api/lists?&seller=${user.address}`)
			.then((res) => res.json())
			.then((data) => {
				setLists(data.data);
			});
	}, [user]);

	if (user === undefined) {
		return <Loading />;
	}
	if (user === null) {
		return <ErrorPage statusCode={404} />;
	}

	const isLoggedUser = address === user.address;
	const hasEmail = !!user.email;
	const buyLists = lists.filter((l) => l.type === 'BuyList');
	const sellLists = lists.filter((l) => l.type === 'SellList');

	return (
		<>
			{isLoggedUser && !hasEmail && (
				<NotificationHeader
					type="error"
					message="Update your email address to receive the sales notifications"
					detailsLink={`/${user.address}/edit`}
				/>
			)}

			<HeaderMetrics user={user} verificationOpen={!!verification} />
			{lists && lists.length > 0 && (
				<div className="flex px-6">
					<div className="w-full md:w-5/6 m-auto">
						{sellLists.length > 0 && (
							<div className="mb-4">
								<Label title="Buy Ads" />
								<ListsTable
									lists={lists.filter((l) => l.type === 'SellList')}
									hideLowAmounts={!isLoggedUser}
								/>
							</div>
						)}
						{buyLists.length > 0 && (
							<div>
								<Label title="Sell Ads" />
								<ListsTable
									lists={lists.filter((l) => l.type === 'BuyList')}
									hideLowAmounts={!isLoggedUser}
								/>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => ({
	props: { title: 'Profile', id: String(context.params?.id), disableAuthentication: true } // will be passed to the page component as props
});

export default Profile;
