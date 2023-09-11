import React from 'react';

interface SectionHeadingProps {
	title: string;
}
const HeaderH3 = ({ title }: SectionHeadingProps) => <h2 className="text-lg font-bold">{title}</h2>;

export default HeaderH3;
