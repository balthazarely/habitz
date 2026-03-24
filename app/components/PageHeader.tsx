interface Props {
  title: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, action }: Props) {
  return (
    <div className="flex items-center justify-between pt-4 pb-2 md:pt-8 md:pb-4">
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      {action}
    </div>
  );
}
