import { ReactNode } from "react";
import { td } from "../../utils/css";

export const Td = ({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <td className={`${td} ${className}`}>
      <div className="flex flex-col items-start justify-center gap-y-1">{children}</div>
    </td>
  );
};
