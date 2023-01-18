import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button } from 'components';
import Link from 'next/link';

const AccountCreated = () => {
	return (
		<>
			<div className="p-4">
				<div className="flex flex-col w-full mt-8 md:w-1/2 md:m-auto md:mt-8 text-center justify-center items-center rounded-lg shadow overflow-hidden bg-white p-8">
					<CheckCircleIcon className="w-24 text-[#3C9AAA] m-auto mb-2" />
					<span className="block text-xl mb-8 text-[#3C9AAA] font-bold">Account Created</span>
					<span className="text-xl mb-8">
						Welcome to OpenPeer,
						<br />
						the decentralized way to buy and sell crypto.
					</span>
					<Link href="/" className="w-1/2 mb-4">
						<Button title="Go to dashboard" />
					</Link>
				</div>
			</div>
		</>
	);
};

export default AccountCreated;
