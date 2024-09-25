import React from 'react';

interface BadgeProps {
	text: string;
	className?: string;
}

const Badge: React.FC<BadgeProps> = ({ text, className = '' }) => {
	return (
		<div className="flex flex-row my-2">
			<div
				className={`flex flex-row text-[12px] border border-blue-200 bg-blue-50 text-blue-600 px-2 rounded-md ${className}`}
			>
				{text}
			</div>
		</div>
	);
};

export default Badge;
