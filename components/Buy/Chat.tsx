'use client';

import React, { useCallback, useState, useEffect } from 'react';
import Talk from 'talkjs';
import { Chatbox } from '@talkjs/react';
import Button from 'components/Button/Button';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { useAccount } from 'wagmi';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import axios from 'axios';

interface UserDetails {
	id: string;
	name: string;
	email?: string;
	photoUrl?: string;
}

interface ChatParams {
	address: `0x${string}`;
	label: 'buyer' | 'seller';
}

const Chat = ({ address, label }: ChatParams) => {
	const { address: currentUserAddress } = useAccount();
	const { isAuthenticated } = useDynamicContext();
	const [showChat, setShowChat] = useState(false);
	const [otherId, setOtherId] = useState<string | null>(null);

	useEffect(() => {
		const fetchOtherId = async () => {
			if (!address || !isAuthenticated) return;

			try {
				const response = await axios.get(`/api/users/${address}`);
				setOtherId(response.data.id);
			} catch (error) {
				console.error('Error fetching user ID:', error);
			}
		};

		fetchOtherId();
	}, [address, isAuthenticated]);

	const syncConversation = useCallback(
		(session: Talk.Session) => {
			const otherUser = new Talk.User(otherId!);
			const conversationId = Talk.oneOnOneId(session.me, otherUser);
			const conversation = session.getOrCreateConversation(conversationId);
			conversation.setParticipant(session.me);
			conversation.setParticipant(otherUser);
			return conversation;
		},
		[otherId]
	);

	const handleOpenChat = () => {
		setShowChat(true);
	};

	if (!isAuthenticated || !currentUserAddress || !otherId) {
		return null;
	}

	return (
		<>
			<Button
				onClick={handleOpenChat}
				title={
					<span className="flex flex-row items-center justify-center">
						<span className="mr-2">Chat with {label}</span>
						<ChatBubbleLeftEllipsisIcon className="w-8" />
					</span>
				}
				outlined
			/>
			{showChat && otherId && (
				<Chatbox
					syncConversation={syncConversation}
					className="mb-4"
					style={{ height: '500px', width: '100%' }}
				/>
			)}
		</>
	);
};

export default Chat;
