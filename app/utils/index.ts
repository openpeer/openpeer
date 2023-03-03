export const smallWalletAddress = (address: `0x${string}`, length = 4): string =>
	`${address.substring(0, length)}..${address.substring(address.length - length)}`;
