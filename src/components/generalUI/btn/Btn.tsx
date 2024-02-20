import { ReactNode, MouseEventHandler } from "react";
import { focus, btnDisabled } from "../../../utils/css";

export const Btn = ({
  type = "button",
  disabled,
  look = "normal",
  children,
  className,
  onClick,
}: {
  type?: "submit" | "reset" | "button";
  disabled?: boolean;
  look?: "normal" | "outline" | "simple";
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) => {
  let custom: string;
  switch (look) {
    case "normal":
      custom = "text-white bg-cyan-500";
      break;
    case "outline":
      custom = "border border-black";
      break;
    case "simple":
      custom = "bg-slate-200";
      break;
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`text-sm py-2 px-4 rounded ${btnDisabled} ${custom} ${focus} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
