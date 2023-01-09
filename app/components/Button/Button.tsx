interface ButtonProps {
	title: string | JSX.Element;
	onClick?: () => void;
	minimal?: boolean;
	outlined?: boolean;
	rounded?: boolean;
	link?: boolean;
}

const Button = ({ title, onClick, minimal = false, outlined = false, rounded = false, link = false }: ButtonProps) => {
	return (
		<button
			className={
				minimal
					? 'text-xl font-bold w-8'
					: outlined
					? 'w-full px-2 py-2.5 rounded border border-[#3C9AAA] text-base text-[#3C9AAA] my-8'
					: rounded
					? 'w-full px-4 py-2 rounded-full bg-[#3C9AAA] text-sm md:text-base text-white'
					: link
					? 'w-auto'
					: 'w-full px-5 py-2.5 rounded bg-[#3C9AAA] text-base text-white'
			}
			onClick={onClick}
		>
			{title}
		</button>
	);
};

export default Button;
