import makeBlockie from 'ethereum-blockies-base64';
import { User } from 'models/types';
import Image from 'next/image';

const Avatar = ({ user, className = 'h-8 w-8 md:h-10 md:w-10' }: { user: User; className?: string }) => {
	const { image_url: imageURL } = user;
	return (
		<Image
			className={`${className} rounded-full`}
			src={imageURL || makeBlockie(user.address)}
			alt="Avatar"
			width={32}
			height={32}
			unoptimized
			priority
		/>
	);
};

export default Avatar;
