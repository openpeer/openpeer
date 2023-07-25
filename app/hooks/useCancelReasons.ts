import { useState } from 'react';

const useCancelReasons = () => {
	const [cancellation, setCancellation] = useState<{ [key: string]: boolean }>({});
	const [otherReason, setOtherReason] = useState<string>('');

	const toggleCancellation = (key: string) => {
		setCancellation({ ...cancellation, [key]: !cancellation[key] });
	};

	return { cancellation, toggleCancellation, otherReason, setOtherReason };
};

export default useCancelReasons;
