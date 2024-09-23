// components/BlockedUsers.tsx
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
	selectedBlockedUsers: User[];
	setSelectedBlockedUsers: (users: User[]) => void;
	context?: 'trade' | 'profile';
}

interface ApiResponse {
	data?: {
		message?: string;
		errors?: string;
	};
}

const BlockedUsers: React.FC<BlockedUsersProps> = ({
	acceptOnlyBlocked,
	setAcceptOnlyBlocked,
	selectedBlockedUsers,
	setSelectedBlockedUsers,
	context = 'profile'
}) => {
	const { address } = useAccount();
	const [ethAddress, setEthAddress] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [loadError, setLoadError] = useState('');
	const [showBlockedUsers, setShowBlockedUsers] = useState(false);

	const fetchUserRelationships = async () => {
		try {
			if (!address) {
				throw new Error('User address not found');
			}
			const response = await axios.get('/api/user_relationships', {
				headers: {
					'X-User-Address': address
				}
			});

			if (response.status === 200) {
				return response.data;
			} else {
				throw new Error('Failed to fetch user relationships');
			}
		} catch (error) {
			console.error('Error fetching user relationships:', error);
			throw error;
		}
	};
	useEffect(() => {
		if (acceptOnlyBlocked || context === 'profile') {
			setIsLoading(true);
			setLoadError('');
			const loadUsers = async () => {
				try {
					const data = await fetchUserRelationships();
					const { blocked_users } = data;
					setSelectedBlockedUsers(blocked_users || []);
				} catch (error) {
					console.error('Error fetching user relationships:', error);
					setLoadError('Failed to load user relationships. Please try again.');
					setSelectedBlockedUsers([]);
				} finally {
					setIsLoading(false);
				}
			};
			loadUsers();
		} else {
			setSelectedBlockedUsers([]);
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

		if (selectedBlockedUsers.some((user) => user.address.toLowerCase() === ethAddress.toLowerCase())) {
			setError('This user is already in your blocked list.');
			return;
		}

		if (!address) {
			setError('User address not found');
			return;
		}

		try {
			const response = await fetch(`/api/user_relationships/blocked/${ethAddress}`, {
				method: 'POST', // Changed from DELETE to POST
				headers: {
					'X-User-Address': address,
					'Content-Type': 'application/json'
				}
			});

			let data: ApiResponse = {};
			try {
				data = await response.json();
			} catch (jsonError) {
				console.error('Error parsing JSON:', jsonError);
				setError('An error occurred while processing the response');
				return;
			}

			if (response.ok) {
				const userResponse = await fetch(`/api/user_search/${ethAddress}`, {
					headers: {
						'X-User-Address': address
					}
				});

				let userData: User;
				try {
					userData = await userResponse.json();
				} catch (userJsonError) {
					console.error('Error parsing user JSON:', userJsonError);
					setError('An error occurred while fetching user details');
					return;
				}

				if (userResponse.ok) {
					setSelectedBlockedUsers([...selectedBlockedUsers, userData]);
					setEthAddress('');
				} else if (userResponse.status === 404) {
					setError('User details not found after adding. Please try again.');
				} else {
					setError('Failed to fetch user details');
				}
			} else if (response.status === 404) {
				setError(data.data?.message || 'User not found in the database. Cannot add non-existent user.');
			} else if (response.status === 422) {
				setError(data.data?.message || 'Failed to add blocked trader: Invalid data');
			} else if (response.status === 500) {
				console.error('Server error:', data);
				setError('An internal server error occurred. Please try again later.');
			} else {
				setError(data.data?.message || 'Failed to add blocked trader');
			}
		} catch (err) {
			console.error('Failed to add blocked trader:', err);
			setError('Failed to add blocked trader');
		}
	};

	const handleDeleteBlockedUser = async (userId: number) => {
		try {
			const userToDelete = selectedBlockedUsers.find((user) => user.id === userId);
			if (!userToDelete) return;

			if (!address) {
				setError('User address not found');
				return;
			}

			const response = await fetch(`/api/user_relationships/blocked/${userToDelete.address}`, {
				method: 'DELETE',
				headers: {
					'X-User-Address': address,
					'Content-Type': 'application/json'
				}
			});

			let data: ApiResponse = {};
			try {
				data = await response.json();
			} catch (jsonError) {
				console.error('Error parsing JSON:', jsonError);
				setError('An error occurred while processing the response');
				return;
			}

			if (response.ok) {
				const updatedUsers = selectedBlockedUsers.filter((user) => user.id !== userId);
				setSelectedBlockedUsers(updatedUsers);
			} else if (response.status === 404) {
				setError(data.data?.message || 'User not found in your blocked list.');
			} else if (response.status === 422) {
				setError(data.data?.message || 'Failed to remove blocked trader: Invalid data');
			} else if (response.status === 500) {
				console.error('Server error:', data);
				setError('An internal server error occurred. Please try again later.');
			} else {
				setError(data.data?.message || 'Failed to remove blocked trader');
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
		<div className="mb-4">
			<div className="my-2">
				<Label title="Blocked Traders" />
				<div
					onClick={handleToggleBlockedUsers}
					className="text-blue-500 hover:text-blue-700 flex items-center justify-left w-full"
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

			{(acceptOnlyBlocked || showBlockedUsers) && (
				<div className="mb-4">
					{isLoading ? (
						<p>Loading blocked traders...</p>
					) : loadError ? (
						<p className="text-red-500">{loadError}</p>
					) : selectedBlockedUsers && selectedBlockedUsers.length > 0 ? (
						<ul className="my-4 flex flex-wrap">
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
					<form onSubmit={handleAddBlockedUser}>
						<input
							type="text"
							placeholder="Enter Ethereum address"
							value={ethAddress}
							onChange={(e) => setEthAddress(e.target.value)}
							className="border p-2 rounded w-96"
						/>
						<button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded ml-2">
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
