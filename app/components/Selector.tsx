import Button from './Button/Button';

interface SelectorProps {
	value: number;
	suffix: string;
	underValue?: string;
	updateValue: (n: number) => void;
}

const Selector = ({ value, suffix, underValue, updateValue }: SelectorProps) => {
	return (
		<div className="flex flex-row justify-between items-center bg-gray-100 my-8 py-4 p-8 border-2 border-slate-200 rounded-md">
			<Button title="-" minimal onClick={() => updateValue(value - 0.01)} />
			<div className="flex flex-col">
				<div className="flex flex-row justify-center items-center text-xl font-bold mb-2">
					<input
						type="tel"
						value={value.toFixed(2)}
						className="bg-white w-1/3 text-center rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-slate-400 mr-2"
					/>
					{suffix}
				</div>
				<div className="text-sm text-center">{underValue}</div>
			</div>
			<Button title="+" minimal onClick={() => updateValue(value + 0.01)} />
		</div>
	);
};

export default Selector;
function handleChange(event: Event | undefined) {
	throw new Error('Function not implemented.');
}
