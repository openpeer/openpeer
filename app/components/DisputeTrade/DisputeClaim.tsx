import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import Label from 'components/Label/Label';
import Textarea from 'components/Textarea/Textarea';
import { useState } from 'react';

import FilesUploader from './FilesUploader';

const DisputeClaim = ({ uuid, address }: { uuid: `0x${string}`; address: `0x${string}` }) => {
	const [comments, setComments] = useState('');
	return (
		<>
			<div>
				<Label title="Comments" />
				<Textarea
					rows={4}
					id="details"
					value={comments}
					placeholder="Tell us more about the transaction"
					onChange={(e) => setComments(e.target.value)}
				/>
			</div>
			<div>
				<Label title="Upload proof" />
				<FilesUploader
					uuid={uuid}
					address={address}
					onUploadFinished={(data) => console.log('finished', data)}
				/>
			</div>
			<div className="-mb-8 hidden">
				<Input label="Pay" id="pay" labelSideInfo="Balance: 250USDT" />
			</div>
			<div className="flex flex-col md:flex-row gap-x-8 items-center">
				<Button title="Cancel" outlined />
				<Button title="Continue" />
			</div>
		</>
	);
};

export default DisputeClaim;
