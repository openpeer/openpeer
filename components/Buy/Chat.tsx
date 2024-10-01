'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Talk from 'talkjs';
import { Chatbox } from '@talkjs/react';
import Button from 'components/Button/Button';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import { useAccount } from 'wagmi';
import axios from 'axios';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

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
	const [otherUserDetails, setOtherUserDetails] = useState<UserDetails | null>(null);
	const [showChat, setShowChat] = React.useState(false);

	useEffect(() => {
		const fetchOtherUserDetails = async () => {
			if (!address || !isAuthenticated) return;

			try {
				// Fetch other user details from your API
				const response = await axios.get(`/api/users/${address}`);
				setOtherUserDetails(response.data);
			} catch (error) {
				console.error('Error fetching other user details:', error);
				// Handle error, maybe set default values
				setOtherUserDetails({
					id: address.toLowerCase(),
					name: address,
					email: `${address}@example.com`,
					photoUrl: '' // or a default image URL
				});
			}
		};

		fetchOtherUserDetails();
	}, [address, isAuthenticated]);

	const syncConversation = useCallback(
		(session: Talk.Session) => {
			const otherUser = new Talk.User({
				id: otherUserDetails?.id || address,
				name: otherUserDetails?.name || address,
				email: otherUserDetails?.email || '',
				photoUrl: otherUserDetails?.photoUrl || undefined, // Ensure photoUrl is either a valid URL or undefined
				role: 'default'
			});

			const conversationId = Talk.oneOnOneId(session.me, otherUser);
			const conversation = session.getOrCreateConversation(conversationId);
			conversation.setParticipant(session.me);
			conversation.setParticipant(otherUser);

			return conversation;
		},
		[otherUserDetails, address]
	);

	const handleOpenChat = () => {
		setShowChat(true);
	};

	// Move the check here to avoid conditional hooks
	if (!otherUserDetails) {
		return null; // or a loading indicator
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
			{showChat && (
				<Chatbox syncConversation={syncConversation} style={{ height: '500px', width: '100% !important' }} />
			)}
		</>
	);
};

export default Chat;
