import { ReactNode } from "react";

export const CheckboxGroup = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <div className={`flex items-center ${className}`}>{children}</div>;
};
