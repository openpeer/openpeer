import { Chat } from 'components/Buy';
import React from 'react';

const ChatPage = () => <Chat address="0xb98206a86e61bc59e9632d06679a5515ebf02e81" label="seller" />;

export async function getServerSideProps() {
	return {
		props: { title: 'Chat Test' }
	};
}

export default ChatPage;
