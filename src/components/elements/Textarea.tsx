export const Textarea = ({
  id,
  name = id,
  placeholder,
  rows,
  maxLength,
  value,
  className = "",
  onChange,
}: {
  id: string;
  name?: string;
  placeholder?: string;
  rows?: number;
  maxLength: number;
  value: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  return (
    <textarea
      id={id}
      name={name}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      value={value}
      // スタイルはinput, select, textareaで連動させる
      className={`border rounded px-2 py-2 focus:outline focus:outline-2 focus:outline-cyan-500/50 ${className}`}
      onChange={onChange}
    />
  );
};
