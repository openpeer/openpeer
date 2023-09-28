import React, { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export interface TooltipProps {
	content: string;
}

const Tooltip = ({ content }: TooltipProps) => {
	const [showTooltip, setShowTooltip] = useState(false);

	return (
		<div
			className="relative"
			onClick={() => setShowTooltip(!showTooltip)}
			onMouseLeave={() => setShowTooltip(false)}
		>
			<div className="absolute top-1/2 transform -translate-y-1/2 cursor-pointer">
				<InformationCircleIcon width="20" height="20" className="text-gray-500" />
			</div>
			{showTooltip && (
				<div className="absolute top-4 left-0 bg-gray-800 text-white p-2 rounded-lg z-50">{content}</div>
			)}
		</div>
	);
};

export default Tooltip;
