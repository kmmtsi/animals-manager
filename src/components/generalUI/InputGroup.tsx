export const InputGroup = ({
  children,
  className = "",
}: {
  className?: string;
  // childrenにはinputとlabelのセットを想定
  children: React.ReactNode;
}) => {
  // selectのグループにも使用中@Sexinput
  return <div className={`grid gap-y-2 ${className}`}>{children}</div>;
};
