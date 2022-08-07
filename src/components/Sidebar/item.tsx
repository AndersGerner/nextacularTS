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
        <a className="text-gray-300 hover:text-white">{data.name}</a>
      </Link>
    </li>
  );
};

export default Item;
