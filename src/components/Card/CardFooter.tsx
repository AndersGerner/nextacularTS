type CardFooterProps = {
  children?: any;
};

const CardFooter: React.FC<CardFooterProps> = ({ children }) => {
  return (
    <div className="flex flex-row items-center justify-between px-5 py-3 space-x-5 bg-gray-100 border-t rounded-b dark:border-t-gray-600 dark:bg-gray-900">
      {children}
    </div>
  );
};

export default CardFooter;
