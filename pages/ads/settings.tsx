import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Toggle from 'components/SwitchToggle/Toggle';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { Checkbox, TimezoneSelect } from 'components';

const AdsSettings = () => {
	const router = useRouter();

	const [isVisible, setIsVisible] = useState(true);

	const handleToggleChange = () => {
		setIsVisible(!isVisible);
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
							You can set a time when you&apos;re online to complete your trades. By default it&apos;s UTC
							time 09:00 - 21:00
						</span>
					</div>
				</div>
				<div className="flex flex-col border border-gray-200 rounded-md p-4">
					<div className="flex flex-row">
						<div className="flex flex-col">
							<div className="font-bold mb-2 text-base text-gray-600">Set your available Times</div>
							<div className="text-gray-600 text-sm">
								<span className="font-bold">
									You can set a time when you&apos;re online to complete a trade.{' '}
								</span>
								By default it&apos;s UTC time 09:00 - 21:00
							</div>
						</div>
						<div>
							<Toggle checked={isVisible} onChange={handleToggleChange} />
						</div>
					</div>
					{isVisible && (
						<div className="flex flex-col">
							<div className="">
								<TimezoneSelect onSelect={() => console.log('narcis')} selected={undefined} />
							</div>
							<div className="flex flex-col">
								<div className="text-base font-medium text-gray-700 ">Select your available time</div>
								<div className="w-full flex flex-row space-x-4">
									<Input
										label="From:"
										id="from"
										containerExtraStyle="w-full my-2 md:my-1.5 text-gray-600"
									/>
									<Input
										label="To:"
										id="to"
										containerExtraStyle="w-full my-2 md:my-1.5 text-gray-600"
									/>
								</div>
							</div>
							<div className="flex flex-col mb-4">
								<Checkbox content="Disable online on weekends" id="" name="" onChange="" key="" />
							</div>
							<div className="flex flex-col-reverse md:flex-row items-center md:space-x-6">
								<Button outlined title="Cancel" />
								<Button title="Save" onClick={() => router.push('/ads')} />
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
