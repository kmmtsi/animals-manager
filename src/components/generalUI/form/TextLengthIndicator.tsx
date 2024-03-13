export const TextLengthIndicator = ({
  currentLength,
  maxLength,
  className = "",
}: {
  currentLength: number;
  maxLength: number;
  className?: string;
}) => {
  const isTooLong = currentLength > maxLength;
  return (
    <div
      className={`text-xs ${
        isTooLong ? "text-red-500" : "text-slate-500"
      } ${className}`}
    >
      {currentLength}/{maxLength}
    </div>
  );
};
