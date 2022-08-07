type IContentTitle = {
  subtitle: string;
  title: string;
};

const ContentTitle: React.FC<IContentTitle> = ({ subtitle, title }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
      <h3 className="text-gray-400">{subtitle}</h3>
    </div>
  );
};

export default ContentTitle;
