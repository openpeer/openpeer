import Image from 'next/image';

interface AvatarProps {
	image: string;
}

const Avatar = ({ image }: AvatarProps) => {
	return (
		<span className="relative inline-block">
			<Image className="h-8 w-8 md:h-10 md:w-10 rounded-full" src={image} alt="Avatar" width={32} height={32} />
		</span>
	);
};

export default Avatar;
