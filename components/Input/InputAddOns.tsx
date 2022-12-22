interface InputProps {
  label: string;
  addOn: string;
  htmlFor?: string;
  inputId?: string;
}

const InputAddOns = ({label, addOn, htmlFor, inputId}: InputProps) => {
  return (
    <div className='my-8'>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          type="text"
          name="price"
          id={inputId}
          className="block w-full rounded-md border-gray-300 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-slate-400"
          placeholder="1000"
          aria-describedby="price-currency"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            {addOn}
          </span>
        </div>
      </div>
    </div>
  )
}

export default InputAddOns;