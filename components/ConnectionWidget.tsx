import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { DynamicWidget } from '@dynamic-labs/sdk-react-core';
import { WalletActionButton } from '@tronweb3/tronwallet-adapter-react-ui';
import { useWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import { useAccount } from 'wagmi';
import Button from './Button/Button';
import Modal from './Modal';

interface ConnectionWidgetProps {
	outlined?: boolean;
}

const ConnectionWidget = ({ outlined = false }: ConnectionWidgetProps) => {
	const [modalOpen, setModalOpen] = useState(false);
	const tron = useWallet();
	const evm = useAccount();

	useEffect(() => {
		if (tron.connected || evm.isConnected) {
			setModalOpen(false);
		}
	}, [tron.connected, evm.isConnected]);

	return (
		<div>
			<div className="flex flex-row items-center space-x-2">
				{!tron.connected && !evm.isConnected ? (
					<Button title="Connect Wallet" onClick={() => setModalOpen(true)} outlined={outlined} />
				) : (
					!modalOpen && (
						<>
							{!evm.isConnected && !evm.isConnecting && <WalletActionButton />}
							{!tron.connected && !tron.connecting && <DynamicWidget />}
						</>
					)
				)}
			</div>

			<Modal open={modalOpen} onClose={() => setModalOpen(false)}>
				<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
					Select the chain
				</Dialog.Title>
				<div className="flex flex-row items-center justify-between sm:gap-3">
					<span className="w-full">
						<h1>EVM</h1>
						<DynamicWidget />
					</span>
					<span className="w-full">
						<h1>TRON</h1>
						<WalletActionButton />
					</span>
				</div>
			</Modal>
		</div>
	);
};

export default ConnectionWidget;
