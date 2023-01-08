import Item from './item'

type MenuProps = {
  data: { name: string; menuItems: Array<{ name: string; path: string }> }
  isLoading?: boolean
  showMenu: boolean
}

const Menu: React.FC<MenuProps> = ({
  data,
  isLoading = false,
  showMenu = false,
}) => {
  return showMenu ? (
    <div className="space-y-2">
      <h5 className="text-sm font-bold text-gray-400 dark:text-gray-500">
        {data.name}
      </h5>
      <ul className="leading-10">
        {data.menuItems.map((entry, index) => (
          <Item key={index} data={entry} isLoading={isLoading} />
        ))}
      </ul>
    </div>
  ) : null
}

export default Menu
