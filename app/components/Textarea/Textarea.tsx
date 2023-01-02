interface TextareaProps {
  label?: string;
  rows: number;
  id: string;
  placeholder?: string;
  value: string | undefined;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea = ({ label, rows, id, placeholder, value, onChange }: TextareaProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-base font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 mb-8">
        <textarea
          rows={rows}
          id={id}
          placeholder={placeholder}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default Textarea;
