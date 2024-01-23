type Props = {
  tag: React.ElementType;
  children: React.ReactNode;
};

export const PageTitle = ({ tag: Tag, children }: Props) => {
  return <Tag className="text-2xl font-medium pb-6">{children}</Tag>;
};
