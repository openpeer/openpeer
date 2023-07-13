import { Types } from 'connectkit';
import makeBlockie from 'ethereum-blockies-base64';
import Image from 'next/image';
import React from 'react';

const CustomAvatar = ({ address, ensImage }: Types.CustomAvatarProps) => {
	if (ensImage || address) {
		return (
			<Image src={ensImage || makeBlockie(address!)} alt="Avatar" width={96} height={96} unoptimized priority />
		);
	}

	return <></>;
};

export default CustomAvatar;
