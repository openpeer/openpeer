interface LabelProps {
  title: string
}

const Label = ({ title }: LabelProps) => {
  return <label className="block text-base font-medium text-gray-700 mb-1">{title}</label>
}

export default Label
