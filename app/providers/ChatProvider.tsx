/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/indent */
import { useSession } from 'next-auth/react';
import React from 'react';
import { WalletChatProvider, WalletChatWidget } from 'react-wallet-chat';
import { useAccount, useNetwork } from 'wagmi';

// create a interface that accept children as a prop

interface ChatProviderProps {
	children: React.ReactNode;
}

const ChatProvider = ({ children }: ChatProviderProps) => {
	const { address: account, connector } = useAccount();
	const { chain } = useNetwork();
	const { data: session } = useSession();
	// @ts-expect-error
	const { token: { name: signature = '', email: message = '' } = {} } = session || {};

	return (
		<WalletChatProvider>
			<WalletChatWidget
				requestSignature={false}
				connectedWallet={
					account && chain ? { walletName: connector?.name || '', account, chainId: chain.id } : undefined
				}
				signedMessageData={
					signature && message
						? {
								signature,
								msgToSign: message
						  }
						: undefined
				}
			/>
			{children}
		</WalletChatProvider>
	);
};

export default ChatProvider;
