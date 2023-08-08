interface ButtonProps {
	title: string;
	onClick?: () => void;
}

const Button = ({ title, onClick }: ButtonProps) => {
	return (
		<button className="w-full md:w-auto px-5 py-2.5 rounded bg-[#3C9AAA] text-base text-white" onClick={onClick}>
			{title}
		</button>
	);
};

export default Button;
