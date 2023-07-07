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
					? 'relative inline-flex items-center px-10 py-2 overflow-hidden text-lg font-medium bg-cyan-600 text-white rounded-md hover:text-white group hover:bg-gray-50'
					: 'relative inline-flex items-center px-12 py-4 overflow-hidden text-lg font-medium bg-cyan-600 text-white rounded-md hover:text-white group hover:bg-gray-50'
			}
		>
			<span className="absolute left-0 block w-full h-0 transition-all bg-gradient-to-r from-cyan-600 via-[#EE8A40] to-[#F09C62] opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease"></span>
			<span className="absolute right-0 flex items-center justify-start w-8 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M14 5l7 7m0 0l-7 7m7-7H3"
					></path>
				</svg>
			</span>
			<span className="relative">{title}</span>
		</div>
	);
};

export default ButtonAnimated;
