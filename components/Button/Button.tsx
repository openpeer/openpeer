// components/Button/Button.tsx
import React from 'react';

interface ButtonProps {
	title: string | JSX.Element;
	onClick?: () => void;
	minimal?: boolean;
	outlined?: boolean;
	rounded?: boolean;
	link?: boolean;
	disabled?: boolean;
	processing?: boolean;
	xyz?: boolean;
	// New props for TelegramSection
	className?: string;
	customBgColor?: string;
}

const Button = ({
	title,
	onClick,
	minimal = false,
	outlined = false,
	rounded = false,
	link = false,
	disabled = false,
	processing = false,
	xyz = false,
	className = '',
	customBgColor
}: ButtonProps) => {
	const baseClasses = minimal
		? 'text-xl font-bold w-8'
		: xyz
		? 'text-xl text-red-600'
		: outlined
		? 'w-full px-2 py-3 rounded border border-cyan-600 text-base text-cyan-600 my-4'
		: processing
		? 'flex flex-row items-center justify-center w-full px-5 py-2.5 rounded bg-cyan-600 text-base text-white'
		: disabled
		? 'w-full px-5 py-3 rounded bg-gray-400 text-base text-white opacity-50 cursor-not-allowed'
		: rounded
		? 'w-full px-4 py-2.5 rounded-full bg-cyan-600 text-sm md:text-base text-white'
		: link
		? 'w-auto'
		: 'w-full px-5 py-3 rounded bg-cyan-600 text-base text-white';

	const combinedClasses = `${baseClasses} ${className}`.trim();
	const style = customBgColor ? { backgroundColor: customBgColor } : {};

	return (
		<button
			type="button"
			className={combinedClasses}
			onClick={onClick}
			disabled={disabled || processing}
			style={style}
		>
			{!!processing && !outlined && (
				<svg
					className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					/>
				</svg>
			)}
			{title}
		</button>
	);
};

export default Button;
