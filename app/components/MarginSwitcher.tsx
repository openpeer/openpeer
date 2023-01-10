import { List } from '../models/types';
import Selector from './Selector';

interface Props {
	selected: List['margin_type'];
	onSelect: (opt: List['margin_type']) => void;
	margin: number | undefined;
	token: string;
	currency: string;
	updateMargin: (n: number) => void;
}

const Option = ({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: Props['onSelect'] }) => (
	<button
		className={`w-full flex justify-center rounded-full py-2 ${selected && 'bg-white text-black'}`}
		onClick={() => onSelect(label.toLowerCase() as List['margin_type'])}
	>
		{label}
	</button>
);

const MarginSwitcher = ({ selected, onSelect, margin, currency, token, updateMargin }: Props) => {
	return (
		<>
			<div className="w-full flex flex-col rounded-full bg-[#F4F6F8]">
				<div className="flex p-1.5 items-center text-[#6A6A6A] font-bold">
					<Option label="Fixed" selected={selected === 'fixed'} onSelect={onSelect} />
					<Option label="Percentage" selected={selected === 'percentage'} onSelect={onSelect} />
				</div>
			</div>
			<>
				{selected === 'fixed' && margin && (
					<Selector
						value={margin}
						suffix={` ${currency} per ${token}`}
						underValue="Spot Price"
						updateValue={updateMargin}
					/>
				)}
				{selected === 'percentage' && <Selector value={margin!} suffix="%" updateValue={updateMargin} />}
			</>
		</>
	);
};

export default MarginSwitcher;
