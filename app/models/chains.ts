import '@rainbow-me/rainbowkit/styles.css';
import 'tailwindcss/tailwind.css';

import { configureChains } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const enabledChains = process.env.NODE_ENV === 'development' ? [polygon, polygonMumbai] : [polygon];
const { chains, provider } = configureChains(enabledChains, [
	alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_API_KEY! }),
	publicProvider()
]);

export { chains, provider };
