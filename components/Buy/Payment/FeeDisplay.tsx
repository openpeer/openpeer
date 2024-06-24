import { useEscrowFee } from 'hooks';
import { Token } from 'models/types';
import React from 'react';
import { formatUnits, parseUnits } from 'viem';

interface FeeDisplayParams {
	escrow?: `0x${string}`;
	token: Token;
	tokenAmount: number;
}

const FeeDisplay = ({ escrow, tokenAmount, token }: FeeDisplayParams) => {
	const { fee, isFetching } = useEscrowFee({ address: escrow, token, tokenAmount, chainId: token.chain_id });

	if (isFetching || !fee) return <></>;

	const rawTokenAmount = parseUnits(tokenAmount.toString(), token.decimals);

	return (
		<>
			<div className="flex flex-row items-center mb-1">
				<span className="text-sm mr-2">Amount To Pay</span>
				<span className="text-base font-medium">
					{`${formatUnits(fee + rawTokenAmount, token.decimals)} ${token.symbol}`}
				</span>
			</div>
			<div className="flex flex-row items-center mb-1">
				<span className="text-sm mr-2">Amount</span>
				<span className="text-base">{`${formatUnits(rawTokenAmount, token.decimals)} ${token.symbol}`}</span>
			</div>
			<div className="flex flex-row items-center mb-1">
				<span className="text-sm mr-2">Fee</span>
				<span className="text-base">{`${formatUnits(fee, token.decimals)} ${token.symbol}`}</span>
			</div>
		</>
	);
};

export default FeeDisplay;
