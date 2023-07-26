/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import { WalletChatProvider, WalletChatWidget } from 'react-wallet-chat';
import { useAccount, useNetwork } from 'wagmi';

interface ChatProviderProps {
	children: React.ReactNode;
}

const ChatProvider = ({ children }: ChatProviderProps) => {
	const { address: account, connector } = useAccount();
	const { chain } = useNetwork();
	// @TODO: add signature and message

	return (
		<WalletChatProvider>
			<div className="hidden md:block">
				<WalletChatWidget
					requestSignature={false}
					connectedWallet={
						account && chain ? { walletName: connector?.name || '', account, chainId: chain.id } : undefined
					}
				/>
			</div>
			{children}
		</WalletChatProvider>
	);
};

export default ChatProvider;
