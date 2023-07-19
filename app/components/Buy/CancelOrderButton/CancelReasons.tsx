import Checkbox from 'components/Checkbox/Checkbox';
import Input from 'components/Input/Input';
import { cancelReasons } from 'models/cancelReasons';
import React from 'react';

interface CancelReasonsProps {
	toggleCancellation: (key: string) => void;
	setOtherReason: (value: string) => void;
}

const CancelReasons = ({ toggleCancellation, setOtherReason }: CancelReasonsProps) => (
	<>
		<div className="text-base text-left mt-4 text-gray-700 font-medium">
			What is the reason for your wish to cancel?
		</div>

		{Object.keys(cancelReasons).map((key) => (
			<Checkbox
				content={cancelReasons[key]}
				id={key}
				name={key}
				onChange={() => toggleCancellation(key)}
				key={key}
			/>
		))}

		<Input
			label="Please, tell us why you're cancelling"
			id="cancelReasonDescription"
			containerExtraStyle="my-2"
			onChange={setOtherReason}
		/>
	</>
);

export default CancelReasons;
