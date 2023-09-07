import React, { ReactNode, createContext, useEffect, useMemo, useState } from 'react';

interface OnSignedMessageParams {
	messageToSign: string;
	signedMessage: string;
}

interface MessageContextType {
	messageToSign: string | null;
	signedMessage: string | null;
}

const MessageContext = createContext<MessageContextType>({} as MessageContextType);

const MessageContextProvider = ({
	children,
	messageToSign,
	signedMessage
}: { children: ReactNode } & OnSignedMessageParams) => {
	const [opMessageToSign, setOpMessageToSign] = useState<string | null>('');
	const [opSignedMessage, setOpSignedMessage] = useState<string | null>('');

	useEffect(() => {
		const updateUserMetadata = async () => {
			if (messageToSign && signedMessage) {
				// save in the localstorage
				localStorage.setItem('opMessageToSign', messageToSign);
				localStorage.setItem('opSignedMessage', signedMessage);
			} else {
				// get from the localstorage
				setOpMessageToSign(localStorage.getItem('opMessageToSign'));
				setOpSignedMessage(localStorage.getItem('opSignedMessage'));
			}
		};

		updateUserMetadata();
	}, [messageToSign, signedMessage]);

	const value = useMemo(
		() => ({ messageToSign: messageToSign || opMessageToSign, signedMessage: signedMessage || opSignedMessage }),
		[messageToSign, signedMessage, opMessageToSign, opSignedMessage]
	);

	return (
		// the Provider gives access to the context to its children
		<MessageContext.Provider value={value}>{children}</MessageContext.Provider>
	);
};

export { MessageContext, MessageContextProvider };
