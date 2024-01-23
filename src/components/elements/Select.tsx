// https://ja.react.dev/reference/react-dom/components/select

export const Select = ({
  id,
  name = id,
  children,
  // onChange,
}: {
  id: string;
  name?: string;
  children: React.ReactNode;
  // onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <select
      id={id}
      name={name}
      // スタイルはinput, select, textareaで連動させる
      className="border rounded px-2 py-2 focus:outline focus:outline-2 focus:outline-cyan-500/50"
      // onChange={onChange}
    >
      {children}
    </select>
  );
};
