import Token from 'components/Token/Token';
import { allChains, blast } from 'models/networks';
import Image from 'next/image';
import React from 'react';
import { getChainToken } from 'utils';
import blastImage from '../../public/blast.png';

export interface NetworkProps {
	id: number;
	size?: number;
}

const Network = ({ id, size = 24 }: NetworkProps) => {
	const chain = allChains.find((c) => c.id === id);

	if (!chain) return <></>;

	if (chain.id === blast.id) {
		return <Image src={blastImage} alt="Blast" width={size} height={size} className="rounded-full" />;
	}

	// @ts-expect-error
	return <Token token={getChainToken(chain)} size={size} />;
};

export default Network;
