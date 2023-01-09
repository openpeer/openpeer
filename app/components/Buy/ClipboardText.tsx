import Button from 'components/Button/Button';

import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

interface ClipboardTextProps {
	itemValue: string;
}

const ClipboardText = ({ itemValue }: ClipboardTextProps) => {
	const copyText = () => {
		navigator.clipboard.writeText(itemValue);
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
