interface ButtonProps {
  title: string;
  onClick?: () => void;
  minimal?: boolean;
}

const Button = ({ title, onClick, minimal = false }: ButtonProps) => {
  return (
    <button
      className={
        minimal
          ? 'text-xl font-bold w-8'
          : 'w-full md:w-auto px-5 py-2.5 rounded bg-[#3C9AAA] text-base text-white'
      }
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
