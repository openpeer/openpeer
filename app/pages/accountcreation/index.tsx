import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Button, Checkbox, Input } from 'components';
import Link from 'next/link';
import Image from 'next/image';
import logoMetamask from '../../public/logo_metamask.svg';

const AccountCreation = () => {
	const [visible, setVisible] = React.useState(false);
	return (
		<>
			<div className="p-4">
				<div className="flex justify-center w-full mt-8 md:w-1/2 md:m-auto md:mt-8">
					<Image src={logoMetamask} alt={''} className="w-120" />
				</div>
				<div className="w-full mt-8 md:w-1/2 md:m-auto md:mt-8 rounded-lg shadow overflow-hidden">
					<div className="py-4 px-8 bg-white">
						<Input id={''} value={undefined} label="Wallet Address" />

						<div className="hidden">
							<div className="flex flex-row items-center text-[#3C9AAA] text-base -ml-1">
								<InformationCircleIcon className="w-6" />
								<span className="pl-2">No account found for this address</span>
							</div>
						</div>

						{visible && (
							<div>
								<Input id={''} value={undefined} label="Username" addOn="0/20" />

								<Input id={''} value={undefined} label="Email Address" />

								<Checkbox
									content={
										<>
											<span>I agree to </span>
											<a href="/terms" className="text-[#3C9AAA] underline" target="_blank">
												privacy policy & terms
											</a>
										</>
									}
									id="terms"
									name="terms"
								/>

								<Checkbox content="Subscribe to our newsletter" id="newsletter" name="newsletter" />
							</div>
						)}

						<div className="flex flex-col flex-col-reverse md:flex-row items-center justify-between mt-8 md:mt-0">
							<span className="w-full md:w-1/2 md:pr-8">
								<Button title="Switch wallet" outlined />
							</span>
							<span className="w-full">
								<div className={visible ? 'hidden' : 'block'}>
									<Button title="Continue" onClick={() => setVisible(!visible)} />
								</div>
								<div className={visible ? 'block' : 'hidden'}>
									<Link href="/accountcreation/accountcreated">
										<Button title="Create New Account" />
									</Link>
								</div>
							</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export async function getServerSideProps() {
	return {
		props: { title: 'Create an OpenPeer Account' } // will be passed to the page component as props
	};
}

export default AccountCreation;
