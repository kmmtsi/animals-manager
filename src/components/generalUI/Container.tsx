export const Container = ({
  children,
  className = "",
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={`w-full 2xl:max-w-screen-2xl mx-auto px-2 lg:px-4 ${className}`}>{children}</div>
  );
};
