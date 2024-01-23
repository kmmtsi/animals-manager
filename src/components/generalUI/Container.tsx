export const Container = ({
  children,
  className = "",
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={`2xl:max-w-screen-2xl mx-auto px-2 ${className}`}>{children}</div>
  );
};
