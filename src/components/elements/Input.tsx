export const Input = ({
  id,
  name = id,
  type = "text",
  autoComplete,
  placeholder,
  required = false,
  className = "",
  maxLength,
  autoFocus = false,
  checked, // どちらかは必ず設定する
  value, // どちらかは必ず設定する
  onChange,
}: {
  id: string;
  name?: string;
  type?: "text" | "email" | "password" | "checkbox";
  autoComplete?: "email" | "new-password" | "current-password";
  placeholder?: string;
  required?: boolean;
  className?: string;
  maxLength?: number;
  autoFocus?: boolean;
  checked?: boolean;
  value: string | number | boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <input
      name={name}
      id={id}
      type={type}
      autoComplete={autoComplete}
      placeholder={placeholder}
      required={required}
      // スタイルはinput, select, textareaで連動させる
      className={`border rounded px-2 py-2 focus:outline focus:outline-2 focus:outline-cyan-500/50 ${className}`}
      maxLength={maxLength}
      autoFocus={autoFocus}
      checked={checked}
      value={value}
      onChange={onChange}
    />
  );
};
