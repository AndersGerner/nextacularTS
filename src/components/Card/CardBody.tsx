export type ICardBody = {
  children?: any;
  subtitle?: string;
  title?: string;
};

const CardBody: React.FC<ICardBody> = ({ children, subtitle, title }) => {
  return (
    <div className="flex flex-col p-5 space-y-3 overflow-auto">
      {title ? (
        <h2 className="text-2xl font-bold">{title}</h2>
      ) : (
        <div className="w-full h-8 bg-gray-400 rounded animate-pulse" />
      )}
      {subtitle && <h3 className="text-gray-400">{subtitle}</h3>}
      <div className="flex flex-col">{children}</div>
    </div>
  );
};

export default CardBody;
