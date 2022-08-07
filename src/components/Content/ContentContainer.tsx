type IContentContainer = {
  children?: any;
};

const ContentContainer: React.FC<IContentContainer> = ({ children }) => {
  return <div className="flex flex-col pb-10 space-y-5">{children}</div>;
};
export default ContentContainer;
