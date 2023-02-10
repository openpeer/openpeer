import { HeaderMetrics, Loading } from 'components';
import ImageUploader from 'components/ImageUploader';
import { User } from 'models/types';
import { GetServerSideProps } from 'next';
import ErrorPage from 'next/error';
import { useEffect, useState } from 'react';

const Profile = ({ id }: { id: number }) => {
	const [user, setUser] = useState<User | null>();

	useEffect(() => {
		// fetch(`/api/users/${id}`)
		// 	.then((res) => res.json())
		// 	.then((data) => {
		// 		if (data.errors) {
		// 			setUser(null);
		// 		} else {
		// 			setUser(data);
		// 		}
		// 	});
		setUser({
			address: '0xB98206A86e61bc59E9632D06679a5515eBf02e81',
			created_at: '2022-12-28T12:33:25.712Z',
			email: 'm.*****@gm*****',
			id: 5,
			image_url: null,
			trades: 16
		});
	}, [id]);

	if (user === undefined) {
		return <Loading />;
	}
	if (user === null) {
		return <ErrorPage statusCode={404} />;
	}

	return (
		<>
			<HeaderMetrics user={user} />
			{/* <ImageUploader address={user.address} /> */}
		</>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => {
	return {
		props: { title: 'Profile', id: String(context.params?.id) } // will be passed to the page component as props
	};
};

export default Profile;
