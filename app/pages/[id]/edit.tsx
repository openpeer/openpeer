import { Avatar, Button, HeaderH3, Input } from 'components';
import { User } from 'models/types';

const EditProfile = () => {
	return (
		<div className="w-full m-auto flex flex-col sm:flex-row px-8 py-4 gap-x-16 justify-center mt-8">
			<div className="w-full md:w-1/4 mb-8">
				<div className="flex items-start">
					<div className="w-48">
						<Avatar
							user={{ address: '0xB98206A86e61bc59E9632D06679a5515eBf02e81', id: 0 } as User}
							className="inline-block h-20 w-20"
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
							<input type="file" id="file-input" className="hidden" />
						</div>
					</div>
				</div>
			</div>
			<div className="w-full md:w-1/2">
				<div className="mb-2">
					<HeaderH3 title="Account info" />
					<Input label="Username" id="username" />
					<Input label="Email Address" id="email" />
				</div>
				<div className="mb-2">
					<HeaderH3 title="Social" />
					<Input label="Twitter" id="twitter" />
				</div>
				<div>
					<Button title="Update profile" />
				</div>
			</div>
		</div>
	);
};

export async function getServerSideProps() {
	return {
		props: { title: 'Edit Profile' } // will be passed to the page component as props
	};
}

export default EditProfile;
