import { Avatar, Button } from 'components';
import Input from 'components/Input/Input';
import HeaderH3 from 'components/SectionHeading/h3';
import Toogle from 'components/SwitchToggle/Toggle';

const EditProfile = () => {
	return (
		<>
			<div className="w-full 2xl:w-1/2 m-auto flex flex-col sm:flex-row p-8 gap-x-16">
				<div className="w-full md:w-1/4 mb-8">
					<div className="flex items-start">
						<div className="w-48">
							{/* <Avatar user={undefined} /> */}
							<img
								className="inline-block h-20 w-20 rounded-full"
								src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
								alt=""
							/>
						</div>
						<div className="ml-3">
							<div className="font-medium text-gray-600 group-hover:text-gray-900 mb-6">
								<p className="text-sm">Profile photo</p>
								<p className="text-xs">We recommend an image of at least 400x400. Gifs work too 🙌</p>
							</div>
							<div>
								<label
									htmlFor="file-input"
									className="w-full px-2 py-2.5 rounded border border-[#3C9AAA] text-base text-[#3C9AAA] hover:bg-[#3C9AAA] hover:text-white my-8 cursor-pointer"
								>
									Upload
								</label>
								<input type="file" id="file-input" className="hidden" onClick={''} />
							</div>
						</div>
					</div>
				</div>
				<div className="w-full md:w-1/2">
					<div className="mb-2">
						<HeaderH3 title={'Account info'} />
						<Input label="Username" id={''} />
						<Input label="Email Address" id={''} />
					</div>
					<div className="mb-2">
						<HeaderH3 title={'Social'} />
						<Input label="Twitter" id={''} />
					</div>
					<div className="mb-4">
						<HeaderH3 title={'Privacy'} />
						<div className="flex flex-row justify-between my-2">
							<span>Hide wallet age?</span>
							<span>
								<Toogle />
							</span>
						</div>
						<div className="flex flex-row justify-between">
							<span>Hide contact info?</span>
							<span>
								<Toogle />
							</span>
						</div>
					</div>
					<div>
						<Button title={'Update profile'} />
					</div>
				</div>
			</div>
		</>
	);
};

export async function getServerSideProps() {
	return {
		props: { title: 'Edit Profile' } // will be passed to the page component as props
	};
}

export default EditProfile;
