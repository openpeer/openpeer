import TransactionFeedback from 'components/Notifications/TransactionFeedback';
import React, { createContext, useContext, useMemo, useState } from 'react';

interface AddRecentTransactionProps {
	hash: `0x${string}`;
	description: string;
}

interface TransactionFeedbackContextValue {
	isOpen: boolean;
	closeModal: () => void;
	addRecentTransaction: (props: AddRecentTransactionProps) => void;
}

const TransactionFeedbackContext = createContext<TransactionFeedbackContextValue | undefined>(undefined);

export const TransactionFeedbackProvider = ({ children }: { children: React.ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [hash, setHash] = useState<`0x${string}`>();
	const [description, setDescription] = useState('');

	const openModal = () => setIsOpen(true);
	const closeModal = () => {
		setHash(undefined);
		setDescription('');
		setIsOpen(false);
	};
	const addRecentTransaction = ({
		description: transactionDescription,
		hash: transactionHash
	}: AddRecentTransactionProps) => {
		setDescription(transactionDescription);
		setHash(transactionHash);
		openModal();
	};

	const contextValue = useMemo(() => ({ isOpen, closeModal, addRecentTransaction }), [isOpen]);

	return (
		<TransactionFeedbackContext.Provider value={contextValue}>
			{children}
			<TransactionFeedback
				open={isOpen}
				onClose={closeModal}
				hash={hash}
				description={description}
				onTransactionReplaced={setHash}
			/>
		</TransactionFeedbackContext.Provider>
	);
};

export const useTransactionFeedbackModal = (): TransactionFeedbackContextValue => {
	const context = useContext(TransactionFeedbackContext);
	if (!context) {
		throw new Error('useTransactionFeedbackModal must be used within a TransactionFeedbackProvider');
	}
	return context;
};
