import { VerifiedIcon } from 'components/Icons';
import React from 'react';

interface VerificationButtonProps {
	onClick?: () => void;
	color?: 'cyan';
}

const VerificationButton = ({ onClick, color }: VerificationButtonProps) => (
	<button
		type="button"
		className={`flex items-center py-2 px-6 border rounded ml-2 cursor-pointer ${
			color ? `border-${color}-600 text-${color}-600` : ''
		}`}
		onClick={onClick}
	>
		Get Verified
		<span className="ml-2">
			<VerifiedIcon />
		</span>
	</button>
);
export default VerificationButton;
