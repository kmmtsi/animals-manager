import { focus, placeHolder } from "../../../utils/css";

export const Input = ({
  id,
  name = id,
  type = "text",
  autoComplete,
  placeholder,
  required,
  className = "",
  maxLength,
  autoFocus,
  value,
  defaultChecked,
  onChange,
  onFocus, // フォーカス時
  onBlur, // フォーカス外時
  onKeyDown,
}: {
  id: string;
  name?: string | undefined;
  type?: "text" | "email" | "password" | "hidden" | "search";
  autoComplete?: "off" | "email" | "new-password" | "current-password";
  placeholder?: string;
  required?: boolean;
  className?: string;
  maxLength?: number;
  autoFocus?: boolean;
  value: string | number;
  defaultChecked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      autoComplete={autoComplete}
      placeholder={placeholder}
      required={required}
      className={`border rounded px-2 py-2 ${placeHolder} ${focus} ${className}`}
      maxLength={maxLength}
      autoFocus={autoFocus}
      value={value}
      defaultChecked={defaultChecked}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    />
  );
};
