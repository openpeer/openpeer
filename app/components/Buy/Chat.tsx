/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/indent */
import Button from 'components/Button/Button';
import { useSession } from 'next-auth/react';
import React from 'react';
// @ts-ignore
import { ChatWithOwner, WalletChatProvider, WalletChatWidget } from 'react-wallet-chat';
import { useAccount, useNetwork } from 'wagmi';

import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';

interface ChatParams {
	address: `0x${string}`;
	label: 'buyer' | 'seller';
}

const Chat = ({ address, label }: ChatParams) => {
	const { address: account, connector } = useAccount();
	const { chain } = useNetwork();
	const { data: session } = useSession();
	// @ts-expect-error
	const { token: { name: signature = '', email: message = '' } = {} } = session || {};

	return (
		<WalletChatProvider>
			<ChatWithOwner
				ownerAddress={address}
				render={
					<Button
						title={
							<span className="flex flex-row items-center justify-center">
								<span className="mr-2">Chat with {label}</span>
								<ChatBubbleLeftEllipsisIcon className="w-8" />
							</span>
						}
						outlined
					/>
				}
			/>

			{process.env.NODE_ENV !== 'production' && (
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
			)}
		</WalletChatProvider>
	);
};

export default Chat;
