interface SwitcherProps {
	leftLabel: string;
	rightLabel: string;
	selected: string;
	onToggle?: (label: string) => void;
}

interface ButtonProps {
	label: string;
	left?: boolean;
	selected: boolean;
	onToggle: SwitcherProps['onToggle'];
}

const Button = ({ label, selected, left = false, onToggle }: ButtonProps) => (
	<button
		type="button"
		className={`${left ? 'rounded-l-md' : 'rounded-r-md -ml-px'} ${
			selected ? 'bg-cyan-600 text-white hover:bg-cyan-800' : 'bg-gray-100 text-black hover:bg-gray-300'
		} relative inline-flex items-center bg-white px-6 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-10`}
		onClick={() => onToggle?.(label)}
	>
		{label}
	</button>
);

export default function Switcher({ leftLabel, rightLabel, selected, onToggle }: SwitcherProps) {
	return (
		<span className="isolate inline-flex rounded-md shadow-sm">
			<Button label={leftLabel} left selected={selected === leftLabel} onToggle={onToggle} />
			<Button label={rightLabel} selected={selected === rightLabel} onToggle={onToggle} />
		</span>
	);
}
