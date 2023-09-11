import React from 'react';

interface SectionHeadingProps {
	title: string;
}
const HeaderH2 = ({ title }: SectionHeadingProps) => <h2 className="text-2xl">{title}</h2>;

export default HeaderH2;
