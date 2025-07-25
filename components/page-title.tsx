export const PageTitle = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <section>
      <h1 className="font-brand text-3xl lg:text-6xl">{title}</h1>
      <p className="font-sans lg:text-sm text-xs">{description}</p>
    </section>
  );
};
