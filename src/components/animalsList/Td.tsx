import { ReactNode } from "react";

export const Td = ({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <td className={`p-2 border ${className}`}>
      <div className="flex flex-col items-start justify-center gap-y-1">{children}</div>
    </td>
  );
};
