import React, { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export interface TooltipProps {
	content: string;
}

const Tooltip = ({ content }: TooltipProps) => {
	const [showTooltip, setShowTooltip] = useState(false);

	const handleIconHover = () => {
		setShowTooltip(true);
	};

	const handleIconLeave = () => {
		setShowTooltip(false);
	};
	return (
		<div className="relative">
			<div
				className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
				onMouseEnter={handleIconHover}
				onMouseLeave={handleIconLeave}
			>
				<InformationCircleIcon width="20" height="20" className="text-gray-500" />
			</div>
			{showTooltip && (
				<div className="absolute top-0 left-0 bg-gray-800 text-white p-2 rounded-lg z-50">{content}</div>
			)}
		</div>
	);
};

export default Tooltip;
