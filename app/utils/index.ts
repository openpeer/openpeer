export const smallWalletAddress = (address: `0x${string}`, length = 4): string =>
	`${address.substring(0, length)}..${address.substring(address.length - length)}`;

export const truncate = (num: number, places: number) => Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
