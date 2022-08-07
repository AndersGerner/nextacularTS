type ICOntent = {
  children: any;
};

const Content: React.FC<ICOntent> = ({ children }) => {
  return (
    <div className="flex flex-col h-full p-5 space-y-5 overflow-y-auto md:p-10 md:w-3/4">
      {children}
    </div>
  );
};

export default Content;
