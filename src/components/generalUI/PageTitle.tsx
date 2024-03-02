import { ElementType, ReactNode } from "react";

export const PageTitle = ({
  tag: Tag,
  children,
  className = "",
}: {
  tag: ElementType;
  children: ReactNode;
  className?: string;
}) => {
  return <Tag className={`text-2xl font-medium ${className}`}>{children}</Tag>;
};
