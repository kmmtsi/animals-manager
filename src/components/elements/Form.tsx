// https://ja.react.dev/reference/react-dom/components/input

import { ReactNode } from "react";

export const Form = ({
  operation,
  children,
  className = "",
}: {
  operation: (data: { [k: string]: FormDataEntryValue }) => void;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <form
      method="post"
      className={`grid gap-y-4 ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        // これ以降の処理を引数として渡す
        operation(formJson);
      }}
    >
      {children}
    </form>
  );
};
