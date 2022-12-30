import { ChangeEventHandler } from 'react';

type DefaultInputProps = {
  disabled: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type: string;
  value: string | number | readonly string[];
};

const DefaultInput: React.FC<DefaultInputProps> = ({
  disabled,
  onChange,
  placeholder = '',
  type,
  value,
}) => {
  return (
    <input
      className="px-3 py-2 h-9 text-sm border rounded md:w-1/2 focus:outline-none focus:border-gray-800 dark:bg-black dark:border-gray-700 dark:focus:border-gray-400"
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  );
};

export default DefaultInput;
