import { Errors, Resolver } from 'models/errors';
import { useState } from 'react';

const useFormErrors = () => {
	const [errors, setErrors] = useState<Errors>({});

	const clearErrors = (keys: string[]) => {
		const cleanErrors = keys.reduce((acc: { [key: string]: undefined }, curr: string) => {
			acc[curr] = undefined;
			return acc;
		}, {});

		setErrors({ ...errors, ...cleanErrors });
	};

	const validate = (resolver: Resolver): boolean => {
		const errorsFound = resolver();
		setErrors(errorsFound);
		return Object.values(errorsFound).length === 0;
	};

	return { errors, clearErrors, validate };
};

export default useFormErrors;
