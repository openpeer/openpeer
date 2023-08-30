import '@quadrata/core-react/lib/cjs/quadrata-ui.min.css';

import Loading from 'components/Loading/Loading';
import { quadrataPassportContracts } from 'models/networks';
import React, { useEffect, useState } from 'react';
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

import {
	Page,
	QuadAttribute,
	QuadClient,
	QuadClientConfig,
	QuadClientEnvironment,
	QuadClientMintParamsReadyCallback,
	QuadMintParamsBigNumbers
} from '@quadrata/client-react';
import QUAD_PASSPORT_ABI from '@quadrata/contracts/abis/QuadPassport.json';
import { useConfirmationSignMessage } from 'hooks';
import { getAuthToken } from '@dynamic-labs/sdk-react';

const quadConfig: QuadClientConfig = {
	environment:
		process.env.NODE_ENV === 'production' ? QuadClientEnvironment.PRODUCTION : QuadClientEnvironment.SANDBOX,
	protocolName: 'OpenPeer'
};

const Quadrata = ({ onFinish, open, onHide }: { onFinish: () => void; open: boolean; onHide: () => void }) => {
	// State
	const [signature, setSignature] = useState<string>();
	const [mintParams, setMintParams] = useState<QuadMintParamsBigNumbers>();
	const [mintComplete, setMintComplete] = useState(false);
	const [accessToken, setAccessToken] = useState('');

	// Hooks
	const { chain: { id: chainId } = { id: 0 } } = useNetwork();
	const { address: account, isConnecting } = useAccount();
	const { data: signMessageData, signMessage, variables } = useConfirmationSignMessage({});

	const requiredAttributes = [QuadAttribute.DID, QuadAttribute.AML];

	useEffect(() => {
		// Fetching access token
		const getApiAccessToken = async () => {
			fetch('/api/quadrata')
				.then((res) => res.json())
				.then((response) => {
					setAccessToken(response.accessToken);
				});
		};

		getApiAccessToken();
	}, []);

	useEffect(() => {
		(async () => {
			if (variables?.message && signMessageData) {
				setSignature(signMessageData);
			}
		})();
	}, [signMessageData, variables?.message]);

	// Claim Passport on-chain
	const { config } = usePrepareContractWrite({
		abi: QUAD_PASSPORT_ABI,
		args: mintParams ? [mintParams.params, mintParams.signaturesIssuers, mintParams.signatures] : undefined,
		address: quadrataPassportContracts[chainId],
		enabled: Boolean(mintParams),
		// @ts-expect-error
		value: mintParams?.fee || BigInt(0),
		functionName: 'setAttributesBulk'
	});

	const { data, write } = useContractWrite(config);

	useWaitForTransaction({
		hash: data?.hash,
		onSuccess: async () => {
			await fetch(`/api/user_profiles/${chainId}`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${getAuthToken()}`
				}
			});
			setMintComplete(true);
			setMintParams(undefined);
			onFinish();
		}
	});

	// Handlers
	const handleSign = async (message: string) => {
		// User clicked the initial sign button
		// Signing the message and updating state.
		// Will navigate to the next step upon signature update
		if (account) {
			signMessage({ message });
		}
	};

	const handlePageChange = (page: Page) => {
		if (page === Page.INTRO && signature) {
			// Intro page navigation will get triggered when a different wallet is detected,
			// Resetting previous signature if present.
			setSignature(undefined);
		}
	};

	const handleMintParamsReady: QuadClientMintParamsReadyCallback = (params) => {
		// Setting mint params to prepare the write function
		setMintParams(params);
	};

	const handleMintClick = async () => {
		// Prompting mint transaction
		write?.();
	};

	if (!account) {
		return <></>;
	}

	if (isConnecting) {
		return <Loading />;
	}

	if (!open) {
		return <></>;
	}

	// User is missing at least one attribute,
	// Onboarding user
	return (
		<QuadClient
			account={account}
			config={quadConfig}
			accessToken={accessToken}
			chainId={chainId}
			onSign={handleSign}
			signature={signature}
			attributes={requiredAttributes}
			onMintClick={handleMintClick}
			mintComplete={mintComplete}
			onPageChange={handlePageChange}
			transactionHash={data?.hash}
			onMintParamsReady={handleMintParamsReady}
			darkMode={false}
			onHide={onHide}
		>
			<Loading />
		</QuadClient>
	);
};

export default Quadrata;
