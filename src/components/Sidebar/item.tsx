import Link from 'next/link';

type ItemProps = {
  data: any;
  isLoading: boolean;
};

const Item: React.FC<ItemProps> = ({ data = null, isLoading = false }) => {
  return isLoading ? (
    <div className="h-6 mb-3 bg-gray-600 rounded animate-pulse" />
  ) : (
    <li>
      <Link href={data.path}>
        <a className="flex w-full px-3 rounded text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-neutral-800 dark:hover:bg-neutral-800">
          {data.name}
        </a>
      </Link>
    </li>
  );
};

export default Item;
