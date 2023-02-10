import { HeaderMetrics } from 'components';
import { GetServerSideProps } from 'next';

const Profile = ({ id }: { id: number }) => {
	return (
		<div className="pt-6">
			<HeaderMetrics />
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => {
	return {
		props: { title: 'Profile', id: String(context.params?.id) } // will be passed to the page component as props
	};
};

export default Profile;
