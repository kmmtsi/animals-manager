import { focus } from "../../../utils/css";
import { ReactNode, ChangeEventHandler } from "react";

export const Select = ({
  id,
  name = id,
  value,
  children,
  onChange,
  defaultValue,
}: {
  id: string;
  name?: string;
  value?: string;
  children: ReactNode;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  defaultValue?: string;
}) => {
  return (
    <select
      id={id}
      name={name}
      value={value}
      className={`border rounded px-2 py-2 cursor-pointer ${focus}`}
      onChange={onChange}
      defaultValue={defaultValue}
    >
      {children}
    </select>
  );
};
