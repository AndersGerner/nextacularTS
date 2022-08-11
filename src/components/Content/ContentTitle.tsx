type ContentTitleProps = {
  subtitle: string;
  title: string;
};

const ContentTitle: React.FC<ContentTitleProps> = ({ subtitle, title }) => {
  return (
    <div>
      <h1 className="dark:text-white text-2xl font-bold md:text-2xl">
        {title}
      </h1>
      <h3 className="dark:text-gray-200 md:text:lg">{subtitle}</h3>
    </div>
  );
};

export default ContentTitle;
