import HeaderH3 from 'components/SectionHeading/h2';
import React from 'react';

const MyEscrow = () => (
	<>
		<div className="flex justify-center mt-4 pt-4 md:pt-6">
			<div className="w-full md:w-1/2 flex flex-col mb-16">
				<HeaderH3 title="Deposit or Withdraw funds" />
				<div className="border border-slate-300 mt-4 p-4 rounded">My Escrow</div>
			</div>
		</div>
	</>
);

export async function getServerSideProps() {
	return {
		props: { title: 'My Escrow' }
	};
}

export default MyEscrow;
