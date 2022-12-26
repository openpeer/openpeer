import Button from './Button/Button';

interface SelectorProps {
  value: string;
  underValue?: string;
}

const Selector = ({ value, underValue }: SelectorProps) => {
  return (
    <div className="flex flex-row justify-between content-center bg-gray-100 my-8 py-4 p-8 border-2 border-slate-200 rounded-md">
      <Button title="-" minimal />
      <div className="flex flex-col item-center">
        <div className="text-xl font-bold">{value}</div>
        <div className="text-sm">{underValue}</div>
      </div>
      <Button title="+" minimal />
    </div>
  );
};

export default Selector;
