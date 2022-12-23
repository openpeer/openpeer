interface InputProps {
  label: string
  htmlFor?: string
  inputId?: string
  type: string
  name: string
  placeholder?: string
}

const Input = ({ label, htmlFor, inputId, type, name, placeholder }: InputProps) => {
  return (
    <div className="my-8">
      <label htmlFor={htmlFor} className="block text-base font-bold text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          type={type}
          name={name}
          id={inputId}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  )
}

export default Input
