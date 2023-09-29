/* eslint-disable @typescript-eslint/indent */
import React from 'react';

interface ButtonProps {
	title: string | JSX.Element;
	onClick?: () => void;
	minimal?: boolean;
	outlined?: boolean;
	disabled?: boolean;
	processing?: boolean;
	icon: JSX.Element;
}

const IconButton = ({
	title,
	onClick,
	minimal = false,
	outlined = false,
	disabled = false,
	processing = false,
	icon
}: ButtonProps) => (
	<button
		type="button"
		className={
			minimal
				? 'text-xl font-bold w-8'
				: outlined
				? 'w-full md:w-auto flex flex-row items-center justify-center px-5 py-3 space-x-2 rounded-xl border border-black text-sm text-black cursor-pointer'
				: processing
				? 'w-full flex flex-row items-center justify-center px-5 py-2.5 rounded bg-gray-400 text-sm text-white'
				: disabled
				? 'w-auto flex flex-row items-center justify-center px-5 py-3 space-x-2  rounded-xl bg-gray-400 text-sm text-white opacity-50 cursor-not-allowed'
				: 'w-full md:w-auto flex flex-row items-center justify-center px-5 py-3 space-x-2  rounded-xl bg-gray-900 border border-gray-900 text-sm text-white cursor-pointer'
		}
		onClick={onClick}
		disabled={disabled || processing}
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
		<span>{title}</span>
		<span>{icon}</span>
	</button>
);

export default IconButton;
