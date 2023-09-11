/* eslint-disable @typescript-eslint/indent */
import React from 'react';

interface ExplainerNotificationProps {
	title: string;
	content: string;
	info?: boolean;
	disclamer?: boolean;
}

const ExplainerNotification = ({ title, content, info = false, disclamer = false }: ExplainerNotificationProps) => (
	<div
		className={
			info
				? 'bg-[#F7FBFC] text-cyan-600 p-4 rounded'
				: disclamer
				? 'bg-[#FEFAF5] text-[#E37A00] p-4 rounded'
				: 'bg-[#F7FBFC] text-cyan-600 p-4 rounded'
		}
	>
		<p className="text-sm font-bold mb-2">{title}</p>
		<p className="text-sm">{content}</p>
	</div>
);

export default ExplainerNotification;
