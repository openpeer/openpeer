import makeBlockie from 'ethereum-blockies-base64';
import Image from 'next/image';
import React from 'react';

const CustomAvatar = ({ url, address }: { url: string | undefined; address: `0x${string}` }) => (
	<Image src={url || makeBlockie(address!)} alt="Avatar" width={96} height={96} unoptimized priority />
);

export default CustomAvatar;
