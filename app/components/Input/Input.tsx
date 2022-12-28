interface InputProps {
  label: string;
  addOn?: string;
  id: string;
  value?: number | string | undefined;
  onChange?: (value: string) => void | undefined;
  type?: 'number' | 'email' | 'text';
  required?: boolean;
  placeholder?: string;
}

const Input = ({
  label,
  id,
  addOn,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder
}: InputProps) => {
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(event.target.value);
  };

  return (
    <div className="my-8">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type={type}
          id={id}
          className="block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-slate-400"
          placeholder={placeholder}
          value={value}
          onChange={onInputChange}
          required={required}
        />
        {!!addOn && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm">{addOn}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
