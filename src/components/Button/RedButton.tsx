import Button from './Button';

type RedButtonProps = {
  title: string;
  onClick: () => void;
  disabled?: boolean;
};

const RedButton: React.FC<RedButtonProps> = ({
  title,
  onClick,
  disabled = false,
}) => {
  return (
    <Button
      className="text-white h-8 text-sm bg-red-600 border border-red-500 hover:bg-transparent hover:text-red-500"
      onClick={onClick}
      disabled={disabled}
    >
      {title}
    </Button>
  );
};

export default RedButton;
