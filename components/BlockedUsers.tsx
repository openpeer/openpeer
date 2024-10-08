import React, { useState, useEffect } from 'react';
import { useAccount } from 'hooks';
import axios from 'axios';
import { User } from 'models/types';
import Label from 'components/Label/Label';
import AddressTooltip from 'components/AddressTooltip';
import { ethers } from 'ethers';

interface BlockedUsersProps {
	acceptOnlyBlocked: boolean;
	setAcceptOnlyBlocked: (value: boolean) => void;
	context?: 'trade' | 'profile' | 'buy';
}

const BlockedUsers: React.FC<BlockedUsersProps> = ({
	acceptOnlyBlocked,
	setAcceptOnlyBlocked,
	context = 'profile'
}) => {
	const { address } = useAccount();
	const [ethAddress, setEthAddress] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [loadError, setLoadError] = useState('');
	const [showBlockedUsers, setShowBlockedUsers] = useState(context === 'buy');

	const [selectedBlockedUsers, setSelectedBlockedUsers] = useState<User[]>([]);
	const [selectedTrustedUsers, setSelectedTrustedUsers] = useState<User[]>([]);

	useEffect(() => {
		if (acceptOnlyBlocked || context === 'profile' || context === 'buy') {
			setIsLoading(true);
			setLoadError('');
			const loadUsers = async () => {
				try {
					const response = await axios.get('/api/user_relationships', {
						headers: {
							'X-User-Address': address
						}
					});
					const { blocked_users, trusted_users } = response.data;
					setSelectedBlockedUsers(blocked_users || []);
					setSelectedTrustedUsers(trusted_users || []);
				} catch (error) {
					console.error('Error fetching user relationships:', error);
					setLoadError('Failed to load user relationships. Please try again.');
					setSelectedBlockedUsers([]);
					setSelectedTrustedUsers([]);
				} finally {
					setIsLoading(false);
				}
			};
			loadUsers();
		} else {
			setSelectedBlockedUsers([]);
			setSelectedTrustedUsers([]);
		}
	}, [acceptOnlyBlocked, context, address]);

	const handleAddBlockedUser = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (selectedBlockedUsers.length >= 100) {
			setError('You can only add up to 100 blocked addresses at this time.');
			return;
		}

		if (!ethers.utils.isAddress(ethAddress)) {
			setError('This is an invalid Ethereum address.');
			return;
		}

		if (ethAddress.toLowerCase() === address?.toLowerCase()) {
			setError("Sorry, you can't block yourself.");
			return;
		}

		if (selectedTrustedUsers.some((user) => user.address.toLowerCase() === ethAddress.toLowerCase())) {
			setError('This user is in your trusted list. Please remove them from the trusted list before blocking.');
			return;
		}

		try {
			const response = await axios.post(
				`/api/user_relationships/blocked/${ethAddress}`,
				{},
				{
					headers: {
						'X-User-Address': address,
						'Content-Type': 'application/json'
					}
				}
			);

			if (response.status === 200) {
				const userResponse = await axios.get(`/api/user_search/${ethAddress}`, {
					headers: {
						'X-User-Address': address
					}
				});
				const userData = userResponse.data;
				setSelectedBlockedUsers([...selectedBlockedUsers, userData]);
				setEthAddress('');
			} else {
				setError(response.data?.message || 'Failed to add blocked trader');
			}
		} catch (err) {
			console.error('Failed to add blocked trader:', err);
			if (axios.isAxiosError(err) && err.response) {
				const { status, data } = err.response;
				if (status === 400 && data.error) {
					setError(data.error);
				} else if (data.message) {
					setError(data.message);
				} else {
					setError('Failed to add blocked trader');
				}
			} else {
				setError('Failed to add blocked trader');
			}
		}
	};

	const handleDeleteBlockedUser = async (userId: number) => {
		try {
			const userToDelete = selectedBlockedUsers.find((user) => user.id === userId);
			if (!userToDelete) return;

			const response = await axios.delete(`/api/user_relationships/blocked/${userToDelete.address}`, {
				headers: {
					'X-User-Address': address,
					'Content-Type': 'application/json'
				}
			});

			if (response.status === 200) {
				const updatedUsers = selectedBlockedUsers.filter((user) => user.id !== userId);
				setSelectedBlockedUsers(updatedUsers);
			} else {
				setError(response.data?.message || 'Failed to remove blocked trader');
			}
		} catch (err) {
			console.error('Failed to remove blocked trader:', err);
			setError('Failed to remove blocked trader');
		}
	};

	const shortenAddress = (address: string | undefined) => {
		if (!address) return 'Unknown Address';
		return `${address.slice(0, 6)}...${address.slice(-6)}`;
	};

	const handleToggleBlockedUsers = () => {
		setShowBlockedUsers(!showBlockedUsers);
	};

	return (
		<div className={`mb-4 ${context === 'buy' ? 'flex flex-col items-center justify-center' : ''}`}>
			{context !== 'buy' && (
				<div className="my-2">
					<Label title="Blocked Traders" />
					<div
						onClick={handleToggleBlockedUsers}
						className="text-blue-500 hover:text-blue-700 flex items-center justify-left w-full cursor-pointer"
					>
						<svg
							className={`w-4 h-4 mr-1 transition-transform ${showBlockedUsers ? 'rotate-90' : ''}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
						{showBlockedUsers ? 'Hide Blocked Traders' : 'Show Blocked Traders'}
					</div>
				</div>
			)}

			{(acceptOnlyBlocked || showBlockedUsers || context === 'buy') && (
				<div className={`mb-4 flex flex-col ${context === 'buy' ? 'items-center' : ''}`}>
					{isLoading ? (
						<p>Loading blocked traders...</p>
					) : loadError ? (
						<p className="text-red-500">{loadError}</p>
					) : selectedBlockedUsers && selectedBlockedUsers.length > 0 ? (
						<ul className={`my-4 flex flex-wrap ${context === 'buy' ? 'justify-center' : 'justify-left'}`}>
							{selectedBlockedUsers.map((user) => (
								<li
									key={user.id}
									className="p-2 mx-1 my-2 rounded-lg border border-red-700 bg-red-100 text-xs flex items-center justify-center"
								>
									<span className="font-bold">{user.name}</span> (
									<AddressTooltip content={user.address}>
										<span>{shortenAddress(user.address)}</span>
									</AddressTooltip>
									)
									<button
										onClick={() => handleDeleteBlockedUser(user.id)}
										title="Delete from your blocked traders"
									>
										<svg
											fill="#EF4444"
											width="16px"
											height="18px"
											viewBox="0 0 32 32"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M16 2C8.832 2 3 7.832 3 15s5.832 13 13 13 13-5.832 13-13S23.168 2 16 2zm0 24c-6.065 0-11-4.935-11-11S9.935 4 16 4s11 4.935 11 11-4.935 11-11 11zm5.707-15.707a1 1 0 00-1.414 0L16 14.586l-4.293-4.293a1 1 0 00-1.414 1.414L14.586 16l-4.293 4.293a1 1 0 001.414 1.414L16 17.414l4.293 4.293a1 1 0 001.414-1.414L17.414 16l4.293-4.293a1 1 0 000-1.414z" />
										</svg>
									</button>
								</li>
							))}
						</ul>
					) : (
						<p className="mb-2">No blocked traders found.</p>
					)}
					<form
						onSubmit={handleAddBlockedUser}
						className={`${context === 'buy' ? 'flex items-center' : 'justify-left'}`}
					>
						<input
							type="text"
							placeholder="Enter Ethereum address"
							value={ethAddress}
							onChange={(e) => setEthAddress(e.target.value)}
							className="border p-2 mr-2 rounded w-96"
						/>
						<button type="submit" className="p-2 bg-blue-500 text-white rounded ml-2 mt-2">
							Add Blocked Trader
						</button>
					</form>
					{error && <p className="text-red-500 mt-2">{error}</p>}
				</div>
			)}
		</div>
	);
};

export default BlockedUsers;
