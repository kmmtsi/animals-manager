import { label } from "../../../utils/css";

export const Label = ({
  htmlFor,
  children,
  className = "",
  required = false,
}: {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}): React.JSX.Element => {
  return (
    <label htmlFor={htmlFor} className={`${label} ${className}`}>
      {required ? (
        // 必須マーク
        <span className="after:content-['*'] after:ml-0.5 after:text-red-500">
          {children}
        </span>
      ) : (
        children
      )}
    </label>
  );
};
