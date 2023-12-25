/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-mixed-spaces-and-tabs */
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { MessageContext } from 'contexts/MessageContext';
import React, { useContext } from 'react';
import { WalletChatProvider, WalletChatWidget } from 'react-wallet-chat-sso';
import useNetwork from 'hooks/useNetwork';
import useAccount from 'hooks/useAccount';

interface ChatProviderProps {
	children: React.ReactNode;
}

const ChatProvider = ({ children }: ChatProviderProps) => {
	const { address: account, walletName } = useAccount();
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
					connectedWallet={account && chain ? { walletName, account, chainId: chain.id } : undefined}
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
