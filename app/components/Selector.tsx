import Button from './Button/Button';
import Input from './Input/Input';

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
						className="bg-transparent w-1/3 text-center border-0 border-b-2 border-gray-300 py-1 mx-2"
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
