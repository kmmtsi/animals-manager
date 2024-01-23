export const Label = ({
  htmlFor,
  children,
  className ="",
  required = false,
}: {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}): React.JSX.Element => {
  return (
    <label htmlFor={htmlFor} className={`text-sm pl-1 ${className}`}>
      {required ? (
        <span className="after:content-['*'] after:ml-0.5 after:text-red-500">
          {children}
        </span>
      ) : (
        children
      )}
    </label>
  );
};
