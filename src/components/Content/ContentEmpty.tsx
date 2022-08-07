type ContentEmptyProps = {
  children: any;
};

const ContentEmpty: React.FC<ContentEmptyProps> = ({ children }) => {
  return (
    <div>
      <div className="flex items-center justify-center p-5 bg-gray-100 border-4 border-dashed rounded">
        <p>{children}</p>
      </div>
    </div>
  );
};

export default ContentEmpty;
