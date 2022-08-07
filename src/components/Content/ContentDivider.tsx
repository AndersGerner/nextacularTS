type ContentDividerProps = {
  thick?: boolean;
};

const ContentDivider: React.FC<ContentDividerProps> = ({ thick }) => {
  return thick ? (
    <hr className="border-2 dark:border-gray-600" />
  ) : (
    <hr className="border dark:border-gray-700" />
  );
};

export default ContentDivider;
