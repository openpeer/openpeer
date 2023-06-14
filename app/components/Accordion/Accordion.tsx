import React, { useState } from 'react';

import { MinusIcon } from '@heroicons/react/20/solid';
import { PlusIcon } from '@heroicons/react/24/solid';

interface AccordionProps {
	title: string;
	content: React.ReactNode;
	open?: boolean;
}

const Accordion = ({ title, content, open = false }: AccordionProps) => {
	const [isOpen, setIsOpen] = useState(open || false);
	return (
		<div className="border-b border-slate-200 overflow-hidden">
			<button
				type="button"
				className="flex items-center justify-between w-full p-4 focus:outline-none"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className="font-medium">{title}</span>
				<span className="ml-2">
					{isOpen ? (
						<MinusIcon className="w-6 h-6 font-bold text-gray-900" />
					) : (
						<PlusIcon className="w-6 h-6 font-bold text-gray-900" />
					)}
				</span>
			</button>
			{isOpen && <div className="text-left p-4 transition-all duration-300">{content}</div>}
		</div>
	);
};

export default Accordion;
