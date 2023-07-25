import React, { createContext, useContext, useMemo, useState } from 'react';

interface TransactionFeedbackContextValue {
	isOpen: boolean;
	openModal: () => void;
	closeModal: () => void;
}

const TransactionFeedbackContext = createContext<TransactionFeedbackContextValue | undefined>(undefined);

export const TransactionFeedbackProvider = ({ children }: { children: React.ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	const contextValue = useMemo(() => ({ isOpen, openModal, closeModal }), [isOpen]);

	return <TransactionFeedbackContext.Provider value={contextValue}>{children}</TransactionFeedbackContext.Provider>;
};

export const useModal = (): TransactionFeedbackContextValue => {
	const context = useContext(TransactionFeedbackContext);
	if (!context) {
		throw new Error('useModal must be used within a TransactionFeedbackProvider');
	}
	return context;
};
