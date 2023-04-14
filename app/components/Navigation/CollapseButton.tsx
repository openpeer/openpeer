import { Bars3BottomLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface CollapseButtonParams {
	onClick: () => void;
	open: boolean;
	border?: boolean;
}

const CollapseButton = ({ onClick, open, border = true }: CollapseButtonParams) => (
	<button
		type="button"
		className={`${
			border ? 'border-r border-gray-200' : ''
		} px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden`}
		onClick={onClick}
	>
		<span className="sr-only">Open sidebar</span>
		{open ? (
			<XMarkIcon className="h-6 w-6" aria-hidden="true" />
		) : (
			<Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
		)}
	</button>
);
export default CollapseButton;
