import React, { useState } from 'react';

export interface AddressTooltipProps {
	content: string;
	children: React.ReactNode;
}

const AddressTooltip = ({ content, children }: AddressTooltipProps) => {
	const [showTooltip, setShowTooltip] = useState(false);

	return (
		<div
			className="relative inline-block"
			onMouseEnter={() => setShowTooltip(true)}
			onMouseLeave={() => setShowTooltip(false)}
		>
			{children}
			{showTooltip && (
				<div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-blue-800 text-white p-2 rounded-lg z-50">
					{content}
				</div>
			)}
		</div>
	);
};

export default AddressTooltip;
