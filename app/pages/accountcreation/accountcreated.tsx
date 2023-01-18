import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import { Button } from 'components';
import Link from 'next/link';

const AccountCreated = () => {
	return (
		<>
			<div className="p-4">
				<div className="flex flex-col w-full mt-8 md:w-1/2 md:m-auto md:mt-8 text-center justify-center items-center rounded-lg shadow overflow-hidden bg-white p-8">
					<CheckBadgeIcon className="w-24 text-[#3C9AAA] m-auto mb-8" />
					<span className="block text-2xl mb-8 text-[#3C9AAA] font-bold">Account Created</span>
					<span className="text-lg mb-8">
						Welcome to OpenPeer, the easy away to Trade crypto, decentralized!
					</span>
					<Link href="/" className="w-1/2">
						<Button title="Go to Dashboard" />
					</Link>
				</div>
			</div>
		</>
	);
};

export default AccountCreated;
