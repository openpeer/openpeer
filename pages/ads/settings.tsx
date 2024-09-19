// pages/ads/settings.tsx
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Toggle from 'components/SwitchToggle/Toggle';
import Button from 'components/Button/Button';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';
import { Checkbox, Loading, TimezoneSelect } from 'components';
import { Option } from 'components/Select/Select.types';
import Select from 'components/Select/Select';
import { useFormErrors, useUserProfile } from 'hooks';
import { Errors } from 'models/errors';
import { allTimezones, useTimezoneSelect } from 'react-timezone-select';
import { User } from 'models/types';
import { toast } from 'react-toastify';
import timezoneMapping from '../../utils/timeZoneMapping';

const timeOptions = Array.from({ length: 24 }, (_, i) => ({
	id: i,
	name: `${i < 10 ? '0' : ''}${i}:00`,
	icon: ''
}));

const AdsSettings = () => {
	const router = useRouter();
	const { errors, clearErrors, validate } = useFormErrors();
	const onUpdateProfile = () => {
		toast.success('Done', {
			theme: 'dark',
			position: 'top-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: false,
			progress: undefined
		});
	};
	const { user, updateUserProfile } = useUserProfile({ onUpdateProfile });
	const { options } = useTimezoneSelect({ labelStyle: 'original', timezones: allTimezones });

	const [isVisible, setIsVisible] = useState(true);
	const [timezone, setTimezone] = useState<Option | undefined>();
	const [from, setFrom] = useState<number>(9);
	const [to, setTo] = useState<number>(21);
	const [disableWeekends, setDisableWeekends] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleToggleChange = () => {
		setIsVisible(!isVisible);
	};

	const resolver = () => {
		const error: Errors = {};

		if (!timezone) {
			error.timezone = 'Please select your timezone';
		}

		if (from === to) {
			error.from = 'From and To times cannot be the same';
			error.to = 'From and To times cannot be the same';
		}

		return error;
	};

	const onSave = () => {
		setLoading(true);
		if (validate(resolver)) {
			clearErrors(['timezone', 'from', 'to']);
			if (timezone && timezone.value) {
				const translatedTimezone = timezoneMapping[timezone.value] || timezone.value;
				const updatedUser = {
					timezone: translatedTimezone,
					available_from: parseInt(from.toString(), 10), // Ensure it's an integer
					available_to: parseInt(to.toString(), 10), // Ensure it's an integer
					weekend_offline: disableWeekends
				};
				updateUserProfile(updatedUser as User);
			}
		}
		setLoading(false);
	};

	useEffect(() => {
		if (user) {
			let option: Option | undefined;
			if (user.timezone) {
				const index = options.findIndex((o) => o.value === user.timezone);
				option = {
					id: index,
					name: options[index]?.label || '',
					value: options[index]?.value || ''
				};
			}
			setTimezone(option);
			setFrom(user.available_from ?? 0);
			setTo(user.available_to ?? 0);
			setDisableWeekends(user.weekend_offline);

			setIsVisible(!!(user.timezone && user.available_from !== null && user.available_to !== null));
		}
	}, [user, options]);

	if (user === undefined || user === null) {
		return <Loading />;
	}

	const userSetup = !!(user.timezone && user.available_from !== null && user.available_to !== null);

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
								<TimezoneSelect onSelect={setTimezone} selected={timezone} error={errors.timezone} />
							</div>
							<div className="flex flex-col">
								<div className="text-base font-medium text-gray-700 ">Select your available time</div>
								<div className="w-full flex flex-row justify-between space-x-4">
									<Select
										onSelect={(o) => setFrom(o?.id ?? 0)}
										selected={timeOptions[from]}
										label="From:"
										options={timeOptions}
										error={errors.from}
										extraStyle="w-full my-2 md:my-1.5 text-gray-600"
									/>
									<Select
										onSelect={(o) => setTo(o?.id ?? 0)}
										selected={timeOptions[to]}
										label="To:"
										options={timeOptions}
										error={errors.to}
										extraStyle="w-full my-2 md:my-1.5 text-gray-600"
									/>
								</div>
							</div>
							<div className="flex flex-col mb-4">
								<Checkbox
									content="Disable online on weekends"
									id="disableWeekends"
									name="disableWeekends"
									checked={disableWeekends}
									onChange={() => setDisableWeekends(!disableWeekends)}
								/>
							</div>
						</div>
					)}
					{(isVisible || userSetup !== isVisible) && (
						<div className="flex flex-col-reverse md:flex-row items-center md:space-x-6">
							<Button outlined title="Cancel" onClick={() => router.push('/ads')} />
							<Button title="Save" onClick={onSave} processing={loading} disabled={loading} />
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
