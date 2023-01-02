interface ButtonProps {
  title: string
  onClick?: () => void
  minimal?: boolean
  outlined?: boolean
}

const Button = ({ title, onClick, minimal = false, outlined = false }: ButtonProps) => {
  return (
    <button
      className={
        minimal
          ? "text-xl font-bold w-8"
          : outlined
          ? "w-full px-5 py-4 rounded border text-base text-black my-8"
          : "w-full px-5 py-2.5 rounded bg-[#3C9AAA] text-base text-white"
      }
      onClick={onClick}
    >
      {title}
    </button>
  )
}

export default Button
