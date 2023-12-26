type Props = {
  className?: string;
  children: React.ReactNode;
};

export const Container: React.FC<Props> = ({ children, className = "" }) => {
  return (
    <div className={`container mx-auto px-2 ${className}`.trim()}>
      {children}
    </div>
  );
};
