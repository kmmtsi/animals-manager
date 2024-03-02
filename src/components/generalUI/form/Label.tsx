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
    // w-fit: labelが横一杯に広がり、空白をクリック時にinputにフォーカスが当たるのを防ぐため
    <label htmlFor={htmlFor} className={`w-fit ${className}`}>
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
