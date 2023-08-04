import React from 'react';

interface ButtonAnimatedProps {
	title: string;
	onClick?: () => void;
	smallButton?: boolean;
}

const ButtonAnimated = ({ title, onClick, smallButton = false }: ButtonAnimatedProps) => {
	return (
		<div
			className={
				smallButton
					? 'relative inline-flex items-center px-10 py-2 overflow-hidden text-lg font-medium text-white border-2 border-white rounded-md hover:text-white hover:border-[#00D4E5]  group hover:bg-[#00D4E5]'
					: 'relative inline-flex items-center px-12 py-4 bg-white overflow-hidden text-lg font-bold text-[#141414] border-2 rounded-md  hover:text-white hover:border-[#00D4E5]  group hover:bg-[#00D4E5]'
			}
		>
			<span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M14 5l7 7m0 0l-7 7m7-7H3"
					></path>
				</svg>
			</span>
			<span className="relative">{title}</span>
		</div>
	);
};

export default ButtonAnimated;
