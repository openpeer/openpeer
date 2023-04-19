import { formatUnits } from 'ethers/lib/utils';
import { useEscrowFee } from 'hooks';
import { Token } from 'models/types';
import React from 'react';

interface FeeDisplayParams {
	escrow?: `0x${string}`;
	token: Token;
	tokenAmount: number;
}

const FeeDisplay = ({ escrow, tokenAmount, token }: FeeDisplayParams) => {
	const { fee, isFetching } = useEscrowFee({ address: escrow, token, tokenAmount });

	if (isFetching && !fee) return <></>;

	return (
		<div className="flex flex-col">
			<span className="text-sm">Fee</span>
			<span className="text-xl">{`${formatUnits(fee!, token.decimals)} ${token.symbol}`}</span>
		</div>
	);
};

export default FeeDisplay;
