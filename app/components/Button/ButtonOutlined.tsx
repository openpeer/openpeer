interface ButtonProps {
  title: string
  onClick?: () => void
}

const Button = ({ title, onClick }: ButtonProps) => {
  return (
    <button
      className="w-full md:w-auto px-5 py-4 rounded border text-base text-black my-8"
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export default Button
