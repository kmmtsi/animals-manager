export const Btn = ({
  type = "button",
  children,
  className,
  onClick,
}: {
  type?: "submit" | "reset" | "button";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      type={type}
      className={`text-white border py-2 px-4 rounded bg-cyan-500 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
