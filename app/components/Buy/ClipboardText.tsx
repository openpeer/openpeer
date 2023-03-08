import Button from 'components/Button/Button';
import { useState } from 'react';

import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

interface ClipboardTextProps {
	itemValue: string;
}

const ClipboardText = ({ itemValue }: ClipboardTextProps) => {
	const [checked, setChecked] = useState(false);
	const copyText = () => {
		navigator.clipboard.writeText(itemValue);
		setChecked(true);
		setTimeout(() => setChecked(false), 2000);
	};

	return (
		<div className="flex flex-row justify-between">
			<span className="mr-2 text">{itemValue}</span>
			<Button
				onClick={copyText}
				title={
					checked ? (
						<ClipboardDocumentCheckIcon className="w-4 text-cyan-600" />
					) : (
						<ClipboardDocumentIcon className="w-4 text-gray-500" />
					)
				}
				link
			/>
		</div>
	);
};

export default ClipboardText;
