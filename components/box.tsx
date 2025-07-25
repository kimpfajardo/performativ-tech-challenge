export const Box = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={`bg-slate-200 rounded-2xl lg:p-4 p-3 flex justify-between ${className}`}>
      {children}
    </div>
  );
};
