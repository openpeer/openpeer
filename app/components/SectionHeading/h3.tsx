interface SectionHeadingProps {
	title: string;
}
const HeaderH3 = ({ title }: SectionHeadingProps) => {
	return (
		<>
			<h2 className="text-lg font-bold">{title}</h2>
		</>
	);
};

export default HeaderH3;
