import { Loading } from 'components';
import { useVerification } from 'hooks';
import { useRouter } from 'next/router';
import React from 'react';

import Synaps from '@synaps-io/react-verify';

const VerificationPage = () => {
	const { verification, verifyStatus } = useVerification();
	const router = useRouter();

	const onFinish = async () => {
		await verifyStatus();
		router.back();
	};
	if (verification === undefined) return <Loading />;

	return <Synaps sessionId={verification.session_id} service="individual" lang="en" onFinish={onFinish} />;
};

VerificationPage.getInitialProps = async () => ({ widget: true });

export default VerificationPage;
