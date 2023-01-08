import Button from './Button'

type PrimaryButtonProps = {
  title: string
  disabled: boolean
  action: (event: React.MouseEvent<HTMLDivElement>) => void
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  disabled,
  action,
}) => {
  return (
    <Button
      className="h-8 text-xs font-bold text-white bg-black hover:bg-transparent hover:text-gray-800 hover:border-black dark:bg-white dark:hover:bg-neutral-900 dark:hover:border-white dark:text-gray-800 border dark:hover:text-white"
      disabled={disabled}
      onClick={action}
    >
      {title}
    </Button>
  )
}

export default PrimaryButton
