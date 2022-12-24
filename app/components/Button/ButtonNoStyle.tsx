interface ButtonNoStyleProps {
  title: string
  className?: string
  onClick?: () => void
}

const ButtonNoStyle = ({ title, className, onClick }: ButtonNoStyleProps) => {
  return (
    <button className={className} onClick={onClick}>
      {title}
    </button>
  )
}

export default ButtonNoStyle
