import Button from './Button';

type PrimaryButtonProps = {
  title: string;
  validationProp?: boolean;
  isSubmitting?: boolean;
  action: (event: any) => void;
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  validationProp,
  isSubmitting,
  action,
}) => {
  return (
    <Button
      className="h-8 text-xs font-bold text-white bg-black hover:bg-transparent hover:text-gray-800 hover:border-black dark:bg-white dark:hover:bg-neutral-900 dark:hover:border-white dark:text-gray-800 border dark:hover:text-white"
      disabled={validationProp || isSubmitting}
      onClick={action}
    >
      {title}
    </Button>
  );
};

export default PrimaryButton;
