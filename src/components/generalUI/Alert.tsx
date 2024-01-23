export const Alert = ({
  role,
  children,
}: {
  role: "success" | "error";
  children: React.ReactNode;
}) => {
  let customCls: string;
  switch (role) {
    case "success":
      customCls = "border-cyan-500 bg-cyan-50 text-cyan-900";
      break;
    case "error":
      customCls = "border-red-500 bg-red-50 text-red-900";
      break;
  }

  return (
    <div className={`text-sm p-4 border rounded ${customCls}`}>{children}</div>
  );
};
