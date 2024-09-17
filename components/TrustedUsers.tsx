// components/TrustedUsers.tsx
import React, { useState, useEffect } from 'react';
import { useAccount } from 'hooks';
import axios from 'axios';
import { User } from 'models/types';
import Checkbox from 'components/Checkbox/Checkbox';
import Label from 'components/Label/Label';
import AddressTooltip from 'components/AddressTooltip';
import { ethers } from 'ethers';

interface TrustedUsersProps {
	acceptOnlyTrusted: boolean;
	setAcceptOnlyTrusted: (value: boolean) => void;
	selectedTrustedUsers: User[];
	setSelectedTrustedUsers: (users: User[]) => void;
	context?: 'trade' | 'profile'; // Updated context prop
}

interface ApiResponse {
	data?: {
		message?: string;
		errors?: string;
	};
}

const TrustedUsers: React.FC<TrustedUsersProps> = ({
	acceptOnlyTrusted,
	setAcceptOnlyTrusted,
	selectedTrustedUsers,
	setSelectedTrustedUsers,
	context = 'trade' // Default to 'trade' context
}) => {
	const { address } = useAccount();
	const [ethAddress, setEthAddress] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [loadError, setLoadError] = useState('');
	const [showTrustedUsers, setShowTrustedUsers] = useState(false); // State to toggle trusted users list

	const fetchUserRelationships = async () => {
		try {
			if (!address) {
				throw new Error('User address not found');
			}
			const response = await axios.get('/api/user_relationships', {
				headers: {
					Authorization: `Bearer ${address}`
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
		if (acceptOnlyTrusted || context === 'profile') {
			setIsLoading(true);
			setLoadError('');
			const loadUsers = async () => {
				try {
					const data = await fetchUserRelationships();
					const { trusted_users } = data; // Adjusted to match backend response
					setSelectedTrustedUsers(trusted_users || []);
				} catch (error) {
					console.error('Error fetching user relationships:', error);
					setLoadError('Failed to load user relationships. Please try again.');
					setSelectedTrustedUsers([]);
				} finally {
					setIsLoading(false);
				}
			};
			loadUsers();
		} else {
			// Clear the selected trusted users when the checkbox is unchecked
			setSelectedTrustedUsers([]);
		}
	}, [acceptOnlyTrusted, context, address]); // Added 'context' and 'address' to dependencies

	const handleAddTrustedUser = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		// Check if the number of trusted users has reached the limit
		if (selectedTrustedUsers.length >= 100) {
			setError('You can only add up to 100 trusted addresses at this time.');
			return;
		}

		// Validate the Ethereum address
		if (!ethers.utils.isAddress(ethAddress)) {
			setError('This is an invalid Ethereum address.');
			return;
		}

		// Prevent adding the user's own address
		if (ethAddress.toLowerCase() === address?.toLowerCase()) {
			setError("There's no need to add your own address as a trusted user.");
			return;
		}

		// Check if the user is already in the trusted list
		if (selectedTrustedUsers.some((user) => user.address.toLowerCase() === ethAddress.toLowerCase())) {
			setError('This user is already in your trusted list.');
			return;
		}

		// Ensure the user address exists
		if (!address) {
			setError('User address not found');
			return;
		}

		try {
			// Make API call to add trusted user
			const response = await fetch(`/api/user_relationships/trusted/${ethAddress}`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${address}`,
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
				// Fetch user details if the addition was successful
				const userResponse = await fetch(`/api/user_search/${ethAddress}`, {
					headers: {
						Authorization: `Bearer ${address}`
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
					setSelectedTrustedUsers([...selectedTrustedUsers, userData]);
					setEthAddress(''); // Reset the input field after successful addition
				} else if (userResponse.status === 404) {
					setError('User details not found after adding. Please try again.');
				} else {
					setError('Failed to fetch user details');
				}
			} else if (response.status === 404) {
				setError(data.data?.message || 'User not found in the database. Cannot add non-existent user.');
			} else if (response.status === 422) {
				setError(data.data?.message || 'Failed to add trusted user: Invalid data');
			} else if (response.status === 500) {
				console.error('Server error:', data);
				setError('An internal server error occurred. Please try again later.');
			} else {
				setError(data.data?.message || 'Failed to add trusted user');
			}
		} catch (err) {
			console.error('Failed to add trusted user:', err);
			setError('Failed to add trusted user');
		}
	};

	const handleDeleteTrustedUser = async (userId: number) => {
		try {
			const userToDelete = selectedTrustedUsers.find((user) => user.id === userId);
			if (!userToDelete) return;

			if (!address) {
				setError('User address not found');
				return;
			}

			const response = await fetch(`/api/user_relationships/trusted/${userToDelete.address}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${address}`,
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
				const updatedUsers = selectedTrustedUsers.filter((user) => user.id !== userId);
				setSelectedTrustedUsers(updatedUsers);
			} else if (response.status === 404) {
				setError(data.data?.message || 'User not found in your trusted list.');
			} else if (response.status === 422) {
				setError(data.data?.message || 'Failed to remove trusted user: Invalid data');
			} else if (response.status === 500) {
				console.error('Server error:', data);
				setError('An internal server error occurred. Please try again later.');
			} else {
				setError(data.data?.message || 'Failed to remove trusted user');
			}
		} catch (err) {
			console.error('Failed to remove trusted user:', err);
			setError('Failed to remove trusted user');
		}
	};

	const shortenAddress = (address: string | undefined) => {
		if (!address) return 'Unknown Address';
		return `${address.slice(0, 6)}...${address.slice(-6)}`;
	};

	const handleToggleTrustedUsers = () => {
		setShowTrustedUsers(!showTrustedUsers);
	};

	return (
		<div className="mb-4">
			{context === 'trade' ? (
				<Checkbox
					content="Accept transactions only from trusted traders that you nominate"
					id="trusted"
					name="trusted"
					checked={acceptOnlyTrusted}
					onChange={() => {
						setAcceptOnlyTrusted(!acceptOnlyTrusted);
						setError('');
						setLoadError('');
					}}
				/>
			) : (
				<div className="my-2">
					<Label title="Trusted Users" />
					<div
						onClick={handleToggleTrustedUsers}
						className="text-blue-500 hover:text-blue-700 flex items-center justify-left w-full"
					>
						<svg
							className={`w-4 h-4 mr-1 transition-transform ${showTrustedUsers ? 'rotate-90' : ''}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
						{showTrustedUsers ? 'Hide Trusted Users' : 'Show Trusted Users'}
					</div>
				</div>
			)}

			{(acceptOnlyTrusted || showTrustedUsers) && (
				<div className="mb-4">
					{context === 'trade' && <Label title="Select Your Trusted Traders" />}
					{isLoading ? (
						<p>Loading trusted users...</p>
					) : loadError ? (
						<p className="text-red-500">{loadError}</p>
					) : selectedTrustedUsers && selectedTrustedUsers.length > 0 ? (
						<ul className="my-4 flex flex-wrap">
							{selectedTrustedUsers.map((user) => (
								<li
									key={user.id}
									className="p-2 mx-1 my-2 rounded-lg border border-blue-700 bg-blue-100 text-xs flex items-center justify-center"
								>
									<span className="font-bold">{user.name}</span> (
									<AddressTooltip content={user.address}>
										<span>{shortenAddress(user.address)}</span>
									</AddressTooltip>
									)
									<button
										onClick={() => handleDeleteTrustedUser(user.id)}
										title="Delete from your trusted traders"
									>
										<svg
											fill="#EF4444"
											width="16px"
											height="18px"
											viewBox="0 0 32 32"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M8 26c0 1.656 1.343 3 3 3h10c1.656 0 3-1.344 3-3l2-16h-20l2 16zM19 13h2v13h-2v-13zM15 13h2v13h-2v-13zM11 13h2v13h-2v-13zM25.5 6h-6.5c0 0-0.448-2-1-2h-4c-0.553 0-1 2-1 2h-6.5c-0.829 0-1.5 0.671-1.5 1.5s0 1.5 0 1.5h22c0 0 0-0.671 0-1.5s-0.672-1.5-1.5-1.5z"></path>
										</svg>
									</button>
								</li>
							))}
						</ul>
					) : (
						<p>No trusted users found.</p>
					)}
					<form onSubmit={handleAddTrustedUser}>
						<input
							type="text"
							placeholder="Enter Ethereum address"
							value={ethAddress}
							onChange={(e) => setEthAddress(e.target.value)}
							className="border p-2 rounded w-96"
						/>
						<button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded ml-2">
							Add Trusted User
						</button>
					</form>
					{error && <p className="text-red-500 mt-2">{error}</p>}
				</div>
			)}
		</div>
	);
};

export default TrustedUsers;
