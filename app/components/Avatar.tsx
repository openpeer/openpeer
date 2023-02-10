import makeBlockie from 'ethereum-blockies-base64';
import { User } from 'models/types';
import Image from 'next/image';

const Avatar = ({ user, className = 'h-8 w-8 md:h-10 md:w-10' }: { user: User; className?: string }) => {
	return (
		<Image
			className={`${className} rounded-full`}
			src={makeBlockie(user.address)}
			alt="Avatar"
			width={32}
			height={32}
		/>
	);
};

export default Avatar;
