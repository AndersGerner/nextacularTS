import Link from 'next/link'

type ItemProps = {
  data: { path: string; name: string }
  isLoading: boolean
}

const Item: React.FC<ItemProps> = ({ data = null, isLoading = false }) => {
  return isLoading ? (
    <div className="h-6 mb-3 bg-gray-600 rounded animate-pulse" />
  ) : (
    <li>
      <Link
        href={data.path}
        className="flex w-full px-3 py-2 my-1 rounded text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100  dark:hover:text-white dark:hover:bg-neutral-800 dark:hover:bg-neutral-800"
      >
        {data.name}
      </Link>
    </li>
  )
}

export default Item
