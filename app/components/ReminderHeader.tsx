import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface ReminderHeaderProps {
	message: string;
	info?: boolean;
	error?: boolean;
	success?: boolean;
	hidden?: boolean;
}

const ReminderHeader = ({
	message,
	info = false,
	error = false,
	success = false,
	hidden = true
}: ReminderHeaderProps) => {
	return (
		<div
			className={
				info
					? 'rounded-md bg-blue-50 p-4 my-4 mx-8 text-blue-700'
					: error
					? 'rounded-md bg-red-50 p-4 my-4 mx-8 text-red-700'
					: success
					? 'rounded-md bg-green-50 p-4 my-4 mx-8 text-green-800'
					: hidden
					? 'hidden'
					: 'rounded-md bg-blue-50 p-4 my-4 mx-8 text-blue-700'
			}
		>
			<div className="flex">
				<div className="flex-shrink-0">
					<InformationCircleIcon className="h-5 w-5" aria-hidden="true" />
				</div>
				<div className="ml-3 flex-1 md:flex md:justify-between">
					<p className="text-sm">{message}</p>
					<p className="mt-3 text-sm md:mt-0 md:ml-6">
						<a href="#" className="whitespace-nowrap font-medium hover:text-gray-800">
							Details
							<span aria-hidden="true"> &rarr;</span>
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default ReminderHeader;
