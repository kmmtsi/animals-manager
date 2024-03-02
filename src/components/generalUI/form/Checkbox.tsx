// https://ja.react.dev/reference/react-dom/components/input

import { ChangeEventHandler } from "react";

export const Checkbox = ({
  id,
  name = id,
  value,
  checked,
  onChange,
  className = "",
}: {
  id?: string;
  name?: string;
  value?: string; // checkedのときに送信される値
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  className?: string;
}) => {
  return (
    <input
      id={id}
      name={name}
      type="checkbox"
      value={value}
      checked={checked}
      onChange={onChange}
      className={`cursor-pointer ${className}`}
    />
  );
};
