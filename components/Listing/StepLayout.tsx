import Button from 'components/Button/Button';
import React from 'react';

const StepLayout = ({
	children,
	onProceed,
	buttonText
}: {
	children?: React.ReactNode;
	onProceed?: () => void;
	buttonText?: string;
}) => (
	<>
		{children}
		{!!onProceed && <Button title={buttonText || 'Proceed'} onClick={onProceed} />}
	</>
);

export default StepLayout;
