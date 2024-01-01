/* eslint-disable @typescript-eslint/indent */
import React from 'react';

interface ExplainerNotificationProps {
	title?: string | JSX.Element;
	content: string;
	info?: boolean;
	disclaimer?: boolean;
}

const ExplainerNotification = ({ title, content, info = false, disclaimer = false }: ExplainerNotificationProps) => (
	<div
		className={
			info
				? 'bg-[#F7FBFC] text-cyan-600 p-4 rounded'
				: disclaimer
				? 'bg-[#FEFAF5] text-[#E37A00] p-4 rounded'
				: 'bg-[#F7FBFC] text-cyan-600 p-4 rounded'
		}
	>
		{title && <div className="text-sm font-bold mb-2">{title}</div>}
		<div className="text-sm">{content}</div>
	</div>
);

export default ExplainerNotification;
