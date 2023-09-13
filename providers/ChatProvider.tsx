/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-mixed-spaces-and-tabs */
import { useDynamicContext } from '@dynamic-labs/sdk-react';
import { MessageContext } from 'contexts/MessageContext';
import React, { useContext } from 'react';
import { WalletChatProvider, WalletChatWidget } from 'react-wallet-chat-sso';
import { useAccount, useNetwork } from 'wagmi';

interface ChatProviderProps {
	children: React.ReactNode;
}

const ChatProvider = ({ children }: ChatProviderProps) => {
	const { address: account, connector } = useAccount();
	const { chain } = useNetwork();
	const { messageToSign, signedMessage } = useContext(MessageContext);
	const { isAuthenticated } = useDynamicContext();
	const signInformation = signedMessage && messageToSign;

	return (
		<WalletChatProvider>
			<div className={isAuthenticated && signInformation ? '' : 'hidden'}>
				<WalletChatWidget
					connectUrl="https://sso-fe.walletchat.fun"
					requestSignature={!signInformation}
					connectedWallet={
						account && chain ? { walletName: connector?.name || '', account, chainId: chain.id } : undefined
					}
					signedMessageData={
						signedMessage && messageToSign
							? {
									signature: signedMessage,
									msgToSign: messageToSign
							  }
							: undefined
					}
				/>
			</div>
			{children}
		</WalletChatProvider>
	);
};

export default ChatProvider;
