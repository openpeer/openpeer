import Button from 'components/Button/Button';
import ChatProvider from 'providers/ChatProvider';
import React from 'react';
import { ChatWithOwner } from 'react-wallet-chat-sso';

import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';

interface ChatParams {
	address: `0x${string}`;
	label: 'buyer' | 'seller';
}

const Chat = ({ address, label }: ChatParams) => (
	<ChatProvider>
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
	</ChatProvider>
);

export default Chat;
