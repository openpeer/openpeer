import { ChartBarSquareIcon, ChatBubbleLeftEllipsisIcon, StarIcon } from '@heroicons/react/20/solid';
import Avatar from 'components/Avatar';
import Button from 'components/Button/Button';

const SummaryBuy = () => {
	return (
		<div className="w-2/4 hidden md:inline-block bg-white rounded-xl border-2 border-slate-100 overflow-hidden shadow-sm md:ml-16 md:px-8 md:py-4 p-4">
			<div className="flex flex-row justify-between items-center mb-6 mt-4 px-2">
				<div className="flex flex-row items-center">
					<Avatar
						image={
							'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80'
						}
					/>
					<span className="ml-2">Crypto Lurd</span>
				</div>
				<div className="flex flex-row">
					<div className="flex flex-row">
						<ChartBarSquareIcon className="w-6 mr-2 text-gray-500" />
						<span>150 Trades</span>
					</div>
					<div className="flex flex-row ml-4">
						<StarIcon className="w-6 mr-2 text-yellow-400" />
						<span> 4.5 </span>
					</div>
				</div>
			</div>
			<ul className="flex flex-col bg-gray-100 rounded-lg p-6">
				<li className="w-full flex flex-row justify-between mb-4">
					<div>Price</div>
					<div className="font-bold">INR₹1.59</div>
				</li>
				<li className="w-full flex flex-row justify-between mb-4">
					<div>Min order</div>
					<div className="font-bold">INR₹10</div>
				</li>
				<li className="w-full flex flex-row justify-between mb-4">
					<div>Max order</div>
					<div className="font-bold">INR₹500</div>
				</li>
				<li className="w-full flex flex-row justify-between mb-4">
					<div>Payment channel</div>
					<div className="font-bold">IMG</div>
				</li>
				<li className="w-full flex flex-row justify-between mb-4">
					<div>Payment Limit</div>
					<div className="font-bold">10 minutes</div>
				</li>
			</ul>
			<div className="mt-6">
				<span className="text-[#3C9AAA]">Please Note</span>
				<p className="mt-2">
					Please do not include any crypto related keywords like USDT or OpenPeer. Thanks for doing business
					with me.
				</p>
				<Button
					title={
						<>
							<span className="flex flex-row items-center justify-center">
								<span className="mr-2">Chat with merchant</span>
								<ChatBubbleLeftEllipsisIcon className="w-8" />
							</span>
						</>
					}
					outlined
				/>
			</div>
		</div>
	);
};

export default SummaryBuy;
