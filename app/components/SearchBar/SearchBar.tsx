import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Input from 'components/Input/Input';

export interface SearchBar {
	label: string;
	id: string;
	placeholder?: string;
}

const SearchBar = ({ label, id, placeholder }: SearchBar) => {
	return (
		<div className="relative">
			<span className="absolute z-50 ml-2 mt-5 md:mt-4 pt-0.5">
				<MagnifyingGlassIcon className="w-4 h-4 text-bold" />
			</span>
			<Input style="pl-7 font-bold" label={label} id={id} placeholder={placeholder} />
		</div>
	);
};
export default SearchBar;
