import { Button } from 'components';
import HeaderH3 from 'components/SectionHeading/h2';
import Select from 'components/Select/Select';
import { Option } from 'components/Select/Select.types';
import React from 'react';

const MyEscrow = () => (
	<>
		<div className="flex justify-center mt-4 pt-4 md:pt-6 text-gray-700">
			<div className="w-full md:w-1/2 flex flex-col mb-16">
				<HeaderH3 title="Deposit or Withdraw funds" />
				<div className="border border-slate-300 mt-4 p-4 rounded">
					<span>Begin by selecting the Chain</span>
					<div className="w-fit">
						<Select
							label="Chain"
							options={[]}
							selected={undefined}
							onSelect={function (option: Option | undefined): void {
								throw new Error('Function not implemented.');
							}}
						/>
					</div>
					<span>
						A new version of OpenPeer is available. Please withdraw your assets and deploy a new escrow
						contract
					</span>
					<div className="mt-4">
						<Button title="Deploying new contract" />
					</div>
				</div>
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
