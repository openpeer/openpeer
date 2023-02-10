import { useState } from 'react';
import { Errors, Resolver } from 'models/errors';

const useFormErrors = () => {
	const [errors, setErrors] = useState<Errors>({});

	const clearErrors = (keys: string[]) => keys.forEach((k) => setErrors({ ...errors, [k]: undefined }));
	const validate = (resolver: Resolver): boolean => {
		const errorsFound = resolver();
		setErrors(errorsFound);
		return Object.values(errorsFound).length === 0;
	};

	return { errors, clearErrors, validate };
};

export default useFormErrors;
