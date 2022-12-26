import Button from './Button/Button';

interface SelectorProps {
  value: number;
  suffix: string;
  underValue?: string;
  updateValue: (n: number) => void;
}

const Selector = ({ value, suffix, underValue, updateValue }: SelectorProps) => {
  return (
    <div className="flex flex-row justify-between content-center bg-gray-100 my-8 py-4 p-8 border-2 border-slate-200 rounded-md">
      <Button title="-" minimal onClick={() => updateValue(value - 1)} />
      <div className="flex flex-col item-center">
        <div className="text-xl font-bold">
          {value}
          {suffix}
        </div>
        <div className="text-sm text-center">{underValue}</div>
      </div>
      <Button title="+" minimal onClick={() => updateValue(value + 1)} />
    </div>
  );
};

export default Selector;
