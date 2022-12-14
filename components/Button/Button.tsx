interface ButtonProps {
  title: string;
}

const Button = ({ title }: ButtonProps) => {
  return (
    <button className="px-5 py-2.5 rounded bg-[#3C9AAA] text-sm text-white">
      {title}
    </button>
  );
};

export default Button;
