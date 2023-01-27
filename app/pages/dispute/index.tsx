import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { Button, Input, Label, Textarea } from 'components';
import { GetServerSideProps } from 'next';

const Dispute = () => {
	return (
		<div className="p-4 md:p-6">
			<div className="p-8 bg-white rounded-lg border border-slate-200 w-full flex flex-col md:flex-row md:gap-x-10">
				<div className="w-full md:w-1/2">
					<div className="flex flex-row pb-1 mb-4 text-cyan-600 text-xl">[IMG] Buy 135 USDT</div>
					<div>
						<Label title="Comments" />
						<Textarea rows={0} id={''} value={undefined} placeholder="Tell us more about the transaction" />
					</div>
					<div>
						<Label title="Upload proof" />
						<label
							htmlFor="file-upload"
							className="bg-transparent relative cursor-pointer rounded-md font-medium"
						>
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
						<Input label="Pay" id={''} LabelSideInfo="Balance: 250USDT" />
					</div>
					<div className="flex flex-col md:flex-row gap-x-8 items-center">
						<Button title="Cancel" outlined />
						<Button title="Continue" />
					</div>
				</div>

				<div className="w-full mt-16 md:mt-0 md:w-1/2 border-l-2 border-gray-200 md:pl-8">
					<h3 className="text-xl pb-4">Points to note about Disputing Trade</h3>
					<ol className="list-decimal text-gray-500 pl-4 space-y-4">
						<li>Kindly state the reason you’re requesting for this dispute.</li>
						<li>Upload proof of transaction</li>
						<li>Comment and proof will be sent to both parties of the transaction</li>
						<li>Note that deceitful and baseless claim can result to permanent banning of your account</li>
						<li>
							When disputing the transaction each party will have to pay a small dispute fee of 1% of the
							transaction, up to a maximum of $10 in USDT each
						</li>
					</ol>
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => {
	// Pass data to the page via props
	return { props: { title: 'Dispute Trade', id: String(context.params?.id) } };
};
export default Dispute;
