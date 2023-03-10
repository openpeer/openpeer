import { tokenImages, TokenImageType } from 'models/tokenImages';
import { Token as TokenModel } from 'models/types';
import Image from 'next/image';
import React from 'react';

interface TokenImageContentProps {
	name: TokenImageType;
	size: number;
	tokenColor: string;
}

export interface TokenProps {
	token: TokenModel;
	size: number;
}

const TokenImage = ({ name, size, tokenColor }: TokenImageContentProps) => {
	const dArr = tokenImages[name].slice(1);
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 32" fill="none">
			{dArr.map((d, idx) => (
				<path fillRule="evenodd" clipRule="evenodd" key={d} d={d} fill={idx === 0 ? tokenColor : 'white'} />
			))}
		</svg>
	);
};

const Token = ({ token, size = 96 }: TokenProps) => {
	const { symbol = '', name, icon } = token || {};
	const formattedName = symbol!.toLowerCase() as TokenImageType;

	if (!formattedName || !tokenImages[formattedName]) {
		return <Image alt={name} src={icon} width={size} height={size} unoptimized />;
	}

	const tokenColor = tokenImages[formattedName][0];

	return <TokenImage name={formattedName} size={size} tokenColor={tokenColor} />;
};

export default Token;
