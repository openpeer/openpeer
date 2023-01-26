import Image from 'next/image';
import logo from 'public/logo.svg';
import { Fragment } from 'react';

import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';

import { Option, SelectProps } from './Select.types';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

export default function Select({ label, options, selected, onSelect }: SelectProps) {
	return (
		<Listbox value={selected} onChange={onSelect}>
			{({ open }) => (
				<>
					<div className="my-8">
						<Listbox.Label className="block text-base font-medium text-gray-700">{label}</Listbox.Label>
						<div className="relative mt-1">
							<Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
								<span className="flex items-center">
									{!!selected && (
										<Image
											src={selected.icon}
											alt={selected.name}
											className="h-6 w-6 flex-shrink-0 rounded-full "
											width={24}
											height={24}
										/>
									)}
									<span className="ml-3 block truncate">{selected?.name || 'Select'}</span>
								</span>
								<span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
									<ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
								</span>
							</Listbox.Button>

							<Transition
								show={open}
								as={Fragment}
								leave="transition ease-in duration-100"
								leaveFrom="opacity-100"
								leaveTo="opacity-0"
							>
								<Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
									{options.map((option) => (
										<Listbox.Option
											key={option.id}
											className={({ active }) =>
												classNames(
													active ? 'text-white bg-indigo-600' : 'text-gray-900',
													'relative cursor-default select-none py-2 pl-3 pr-9'
												)
											}
											value={option}
										>
											{({ selected, active }) => (
												<>
													<div className="flex items-center">
														<Image
															src={option.icon}
															alt={option.name}
															className="h-6 w-6 flex-shrink-0 rounded-full"
															width={24}
															height={24}
														/>

														<span
															className={classNames(
																selected ? 'font-semibold' : 'font-normal',
																'ml-3 block truncate'
															)}
														>
															{option.name}
														</span>
													</div>

													{selected && (
														<span
															className={classNames(
																active ? 'text-white' : 'text-indigo-600',
																'absolute inset-y-0 right-0 flex items-center pr-4'
															)}
														>
															<CheckIcon className="h-5 w-5" aria-hidden="true" />
														</span>
													)}
												</>
											)}
										</Listbox.Option>
									))}
								</Listbox.Options>
							</Transition>
						</div>
					</div>
				</>
			)}
		</Listbox>
	);
}
