type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Btn: React.FC<Props> = ({ type, children }) => {
  return (
    <button
      type={type}
      className="text-white border py-2 px-4 rounded bg-cyan-500 mt-4"
    >
      {children}
    </button>
  );
};
