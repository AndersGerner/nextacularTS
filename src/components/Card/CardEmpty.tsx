type CardEmptyProps = {
  children: any;
};

const CardEmpty: React.FC<CardEmptyProps> = ({ children }) => {
  return (
    <div>
      <div className="flex items-center justify-center p-5 bg-gray-100 border-4 border-dashed rounded dark:bg-transparent dark:border-gray-600">
        <p>{children}</p>
      </div>
    </div>
  );
};
export default CardEmpty;
