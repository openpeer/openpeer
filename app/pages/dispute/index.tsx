import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { Button, Input, Label, Textarea } from 'components';
import DisputeClaim from 'components/DisputeTrade/claim';
import DisputeStatus from 'components/DisputeTrade/status';
import { GetServerSideProps } from 'next';

const Dispute = () => {
	return (
		<div className="p-4 md:p-6">
			<div className="p-8 bg-white rounded-lg border border-slate-200 w-full flex flex-col md:flex-row md:gap-x-10">
				<div className="w-full md:w-1/2">
					<div className="flex flex-row pb-1 mb-4 text-cyan-600 text-xl">[IMG] Buy 135 USDT</div>
					<span className="hidden">
						<DisputeClaim />
					</span>
					<DisputeStatus />
				</div>

				<div className="w-full mt-16 md:mt-0 md:w-1/2 border-l-2 border-gray-200 md:pl-8">
					<h3 className="text-xl pb-4">Points to note about Disputing Trade</h3>
					<ol className="list-decimal text-gray-500 pl-4 space-y-4">
						<li>Kindly state the reason you’re requesting for this dispute.</li>
						<li>Upload proof of transaction.</li>
						<li>Comment and proof will be sent to both parties of the transaction.</li>
						<li>Note that deceitful and baseless claim can result to permanent banning of your account.</li>
						<li>
							When disputing the transaction each party will have to pay a small dispute fee of 1% of the
							transaction, up to a maximum of $10 in USDT each.
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
