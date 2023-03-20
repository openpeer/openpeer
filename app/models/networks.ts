export const DEPLOYER_CONTRACTS: { [key: number]: `0x${string}` } = {
	137: process.env.NEXT_PUBLIC_POLYGON_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`,
	80001: process.env.NEXT_PUBLIC_MUMBAI_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`
};

export const networkApiKeys: { [key: number]: string } = {
	137: process.env.NEXT_PUBLIC_BICONOMY_MATIC_API_KEY!,
	80001: process.env.NEXT_PUBLIC_BICONOMY_MATICMUM_API_KEY!
};
