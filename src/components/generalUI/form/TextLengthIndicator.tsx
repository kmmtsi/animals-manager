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
      className={`text-xs pl-1 flex gap-x-2 ${
        isTooLong ? "text-red-500" : "text-slate-500"
      } ${className}`}
    >
      <div>
        {currentLength}/{maxLength}
      </div>
      {isTooLong && <div>入力可能な文字数を超過しています</div>}
    </div>
  );
};
