import Button from 'components/Button/Button';
import React, { useState } from 'react';
// @ts-ignore
import { WalletChatWidget } from 'react-wallet-chat';

import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';

interface ChatParams {
	address: `0x${string}`;
	label: 'buyer' | 'seller';
}

const Chat = ({ address, label }: ChatParams) => {
	const [widgetState, setWidgetState] = useState({});
	return (
		<>
			<Button
				onClick={() => {
					setWidgetState({
						...widgetState,
						chatAddr: address,
						isOpen: true
					});
				}}
				title={
					<span className="flex flex-row items-center justify-center">
						<span className="mr-2">Chat with {label}</span>
						<ChatBubbleLeftEllipsisIcon className="w-8" />
					</span>
				}
				outlined
			/>

			{process.env.NODE_ENV !== 'development' && <WalletChatWidget widgetState={widgetState} />}
		</>
	);
};

export default Chat;
