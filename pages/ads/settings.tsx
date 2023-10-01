import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Toggle from 'components/SwitchToggle/Toggle';
import Select from 'components/Select/Select';
import { Option } from 'components/Select/Select.types';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';

const AdsSettings = () => {
	const onSelect = [0, 1, 2];

	const [isDivVisible, setDivVisible] = useState(true);

	const handleToggleChange = () => {
		setDivVisible(true);
	};

	return (
		<div className="py-6">
			<div className="w-full md:w-1/2 m-auto w-mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
				<Link className="flex flex-row items-center text-sm text-gray-500 py-4" href="/ads">
					<ArrowLeftIcon width="16" height="16" className="mr-2" />
					Back to My Ads
				</Link>
				<div className="w-full flex flex-row items-start justify-between mb-6">
					<div className="flex flex-col">
						<h2 className="text-2xl font-bold mb-4">Settings</h2>
						<span className="w-auto text-gray-600">
							You can set a time when you're online to complete your trades. By default it's UTC time
							09:00 - 21:00
						</span>
					</div>
				</div>
				<div className="flex flex-col bg-gray-100 border border-gray-200 rounded-md p-4">
					<div className="flex flex-row">
						<div className="flex flex-col">
							<div className="font-bold mb-2 text-base text-gray-600">Set your available Times</div>
							<div className="text-gray-600 text-sm">
								<span className="font-bold">
									You can set a time when you're online to complete a trade.
								</span>
								By default it's UTC time 09:00 - 21:00
							</div>
						</div>
						<div>
							<Toggle onChange={handleToggleChange} />
						</div>
					</div>
					{!!isDivVisible && (
						<div className="flex flex-col">
							<div className="">
								<Select
									label="Select your Time Zone"
									options={[]}
									selected={undefined}
									onSelect={function (option: Option | undefined): void {
										throw new Error('Function not implemented.');
									}}
								/>
							</div>
							<div className="flex flex-col mb-4">
								<div className="text-base font-medium text-gray-700 ">Select your available time</div>
								<div className="w-full flex flex-row space-x-4">
									<Input label="From:" id="from" containerExtraStyle="w-full my-2 text-gray-600" />
									<Input label="To:" id="to" containerExtraStyle="w-full my-2 text-gray-600" />
								</div>
							</div>
							<div className="flex flex-col md:flex-row items-center space-x-6">
								<Button outlined title="Cancel" />
								<Button title="Save" />
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async () => ({
	props: { title: 'Ads Settings' }
});

export default AdsSettings;
