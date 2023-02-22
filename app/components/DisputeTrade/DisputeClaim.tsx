import Button from 'components/Button/Button';
import Input from 'components/Input/Input';
import Label from 'components/Label/Label';
import Textarea from 'components/Textarea/Textarea';

import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

const DisputeClaim = () => {
	return (
		<>
			<div>
				<Label title="Comments" />
				<Textarea rows={0} id="details" value={undefined} placeholder="Tell us more about the transaction" />
			</div>
			<div>
				<Label title="Upload proof" />
				<label htmlFor="file-upload" className="bg-transparent relative cursor-pointer rounded-md font-medium">
					<div className="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-dashed border-cyan-600 bg-gray-100">
						<CloudArrowUpIcon className="text-cyan-600 w-10" />
						<div className="flex text-sm text-gray-600">
							<span className="text-cyan-600 underline hover:no-underline">Upload a file</span>
							<input id="file-upload" name="file-upload" type="file" className="sr-only" />
							<p className="pl-1">or drag and drop</p>
						</div>
						<p className="text-xs text-gray-500 py-2">Supported formats: JPEG, JPG, PNG, PDF</p>
					</div>
				</label>
			</div>
			<div className="-mb-8">
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
