import { ReactNode } from "react";
import { formGapY } from "../../../utils/css";

export const Form = ({
  operation,
  children,
  className = "",
}: {
  operation: (
    data: { [k: string]: FormDataEntryValue },
    form: HTMLFormElement
  ) => void;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <form
      method="post"
      className={`${formGapY} ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        // これ以降の処理を引数として渡す
        operation(formJson, form);
      }}
    >
      {children}
    </form>
  );
};
