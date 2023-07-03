import { arbitrum, avalanche, bsc, mainnet, optimism, polygon, polygonMumbai } from 'wagmi/chains';

export const DEPLOYER_CONTRACTS: { [key: number]: `0x${string}` } = {
	[polygon.id]: process.env.NEXT_PUBLIC_POLYGON_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`,
	[avalanche.id]: process.env.NEXT_PUBLIC_AVAX_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`,
	[polygonMumbai.id]: process.env.NEXT_PUBLIC_MUMBAI_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`,
	[arbitrum.id]: process.env.NEXT_PUBLIC_ARBITRUM_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`,
	[optimism.id]: process.env.NEXT_PUBLIC_OPTIMISM_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`,
	[mainnet.id]: process.env.NEXT_PUBLIC_ETHEREUM_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`,
	[bsc.id]: process.env.NEXT_PUBLIC_BSC_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`
	// [gnosis.id]: process.env.NEXT_PUBLIC_GNOSIS_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`
};

export const networkApiKeys: { [key: number]: string } = {
	[polygon.id]: process.env.NEXT_PUBLIC_BICONOMY_MATIC_API_KEY!,
	[polygonMumbai.id]: process.env.NEXT_PUBLIC_BICONOMY_MATICMUM_API_KEY!
};

export const quadrataPassportContracts: { [key: number]: `0x${string}` } = {
	[polygon.id]: '0x2e779749c40CC4Ba1cAB4c57eF84d90755CC017d',
	[avalanche.id]: '0x97058A9B7D0ce525009083F9b2C219336ce97736',
	[polygonMumbai.id]: '0x185cc335175B1E7E29e04A321E1873932379a4a0',
	[mainnet.id]: '0x2e779749c40CC4Ba1cAB4c57eF84d90755CC017d'
};

export const productionChains = [polygon, mainnet, arbitrum, optimism, bsc, avalanche];

export const devChains = [...productionChains, polygonMumbai];
