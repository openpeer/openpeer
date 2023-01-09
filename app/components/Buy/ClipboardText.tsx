import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import Button from 'components/Button/Button';
interface ClipboardTextProps {
	itemValue: string;
}

const ClipboardText = ({ itemValue }: ClipboardTextProps) => {
	const copyText = (event) => {
		const text = event.target.parentElement.querySelector('.text');
		navigator.clipboard.writeText(text.textContent);
		console.log(text);
		console.log(text.textContent);
	};
	return (
		<div className="flex flex-row justify-between">
			<span className="mr-2 text">{itemValue}</span>
			<Button
				onClick={copyText}
				title={
					<>
						<ClipboardDocumentIcon className="w-4 text-gray-500" />
					</>
				}
				link
			/>
		</div>
	);
};

export default ClipboardText;
