export const DEPLOYER_CONTRACTS: { [key: number]: `0x${string}` } = {
	137: process.env.NEXT_PUBLIC_POLYGON_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`,
	80001: process.env.NEXT_PUBLIC_MUMBAI_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`
};

export const networkApiKeys: { [key: number]: string } = {
	137: process.env.NEXT_PUBLIC_BICONOMY_MATIC_API_KEY!,
	80001: process.env.NEXT_PUBLIC_BICONOMY_MATICMUM_API_KEY!
};

export const quadrataPassportContracts: { [key: number]: `0x${string}` } = {
	137: '0x2e779749c40CC4Ba1cAB4c57eF84d90755CC017d',
	80001: '0x185cc335175B1E7E29e04A321E1873932379a4a0'
};
