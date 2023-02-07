import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

const useConnection = () => {
	const { chain } = useNetwork();
	const { address } = useAccount();
	const { data: session, status } = useSession();
	const [wrongNetwork, setWrongNetwork] = useState(false);

	useEffect(() => {
		setWrongNetwork(!!(!session || !address || !chain || chain.unsupported));
	}, [address, chain, session, status]);

	return { wrongNetwork, status };
};

export default useConnection;
