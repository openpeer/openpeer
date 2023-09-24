import React from 'react';
import ModalWindow from './Modal/ModalWindow';

const IdVerificationNeeded = () => (
	<>
		<div className="flex flex-row  my-2">
			<div className="flex flex-row text-[12px] border border-orange-200 bg-orange-50 text-orange-400 px-2 rounded-md">
				ID verification needed
			</div>
		</div>
		<ModalWindow
			title="ID Verification Needed"
			content={
				<div className="py-4">
					You're almost set. Please, take a moment to verify some information before continue, we use Quadrata
					a secure service.
				</div>
			}
			type="confirmation"
			actionButtonTitle="Verify Id and continue"
			open={true}
			onClose={function (): void {
				throw new Error('Function not implemented.');
			}}
			onAction={function (): void {
				throw new Error('Function not implemented.');
			}}
		/>
	</>
);

export default IdVerificationNeeded;
