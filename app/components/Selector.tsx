import ButtonNoStyle from "./Button/ButtonNoStyle"

interface SelectorProps {
  value: string
  underValue?: string
}

const Selector = ({ value, underValue }: SelectorProps) => {
  return (
    <div className="flex flex-row justify-between content-center bg-gray-100 my-8 py-4 p-8 border-2 border-slate-200 rounded-md">
      <ButtonNoStyle title="-" className="text-xl font-bold w-8" />
      <div className="flex flex-col item-center">
        <div className="text-xl font-bold">{value}</div>
        <div className="text-sm">{underValue}</div>
      </div>
      <ButtonNoStyle title="+" className="text-xl font-bold w-8" />
    </div>
  )
}

export default Selector
