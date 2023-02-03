import DisputeClaim from 'components/DisputeTrade/Claim';
import DisputeNotes from 'components/DisputeTrade/DisputeNotes';
import DisputeStatus from 'components/DisputeTrade/Status';
import ModalWindow from 'components/Modal/Modal';

import { GetServerSideProps } from 'next';

const Dispute = () => {
	return (
		<div className="p-4 md:p-6 w-full  2xl:w-1/2 m-auto mb-16">
			<div className="p-8 bg-white rounded-lg border border-slate-200 w-full flex flex-col md:flex-row md:gap-x-10">
				<div className="w-full md:w-1/2">
					<div className="flex flex-row pb-1 mb-4 text-cyan-600 text-xl">[IMG] Buy 135 USDT</div>
					<span className="hidden">
						<DisputeClaim />
					</span>
					<span className="">
						<DisputeStatus />
					</span>
				</div>
				<DisputeNotes />
				<ModalWindow
					title={'Cancel Dispute?'}
					content="Once you cancel the dispute and the merchant accepts the cancellation
					then this order will be cancelled"
					error="true"
					actionButtonTitle="Yes, confirm"
				/>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (context) => {
	// Pass data to the page via props
	return { props: { title: 'Dispute Trade', id: String(context.params?.id) } };
};
export default Dispute;
