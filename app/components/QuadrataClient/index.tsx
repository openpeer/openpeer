import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import Quadrata from './Quadrata';

const queryClient = new QueryClient();

const QuadrataClient = ({ onFinish, open, onHide }: { onFinish: () => void; open: boolean; onHide: () => void }) => (
	<QueryClientProvider client={queryClient}>
		<Quadrata onFinish={onFinish} open={open} onHide={onHide} />
	</QueryClientProvider>
);

export default QuadrataClient;
