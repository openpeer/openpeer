import { Chain } from 'wagmi';
// @ts-expect-error
import TronWeb from 'tronweb';

export default (chain: Chain) =>
	(window.tronWeb as TronWeb) ||
	new TronWeb({
		// @TODO: check how this works with other wallets
		// @ts-expect-error
		fullHost: chain.fullHost
	});
