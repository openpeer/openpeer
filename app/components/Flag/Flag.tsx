/* eslint-disable react/no-array-index-key */
import React from 'react';

import { flags, FlagType } from './flags';

export interface FlagProps {
	name: FlagType;
	size: number;
}

const Flag = ({ name = '', size = 96 }: FlagProps) => {
	const dArr = flags[name];

	if (!dArr) return <></>;

	const newDArr = dArr.reduce((acc, _, idx, arr) => {
		if (idx % 2 === 0) acc.push(arr.slice(idx, idx + 2));
		return acc;
	}, [] as any);

	return (
		<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 32" fill="none">
			{newDArr.map((item: string, idx: number) => (
				<path key={`${name}-${idx}`} d={item[0]} fill={item[1]} />
			))}
		</svg>
	);
};

export default Flag;
