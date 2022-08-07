import Item from './item';

type MenuProps = {
  data: any;
  isLoading?: boolean;
  showMenu: boolean;
};

const Menu: React.FC<MenuProps> = ({
  data,
  isLoading = false,
  showMenu = false,
}) => {
  return showMenu ? (
    <div className="space-y-2">
      <h5 className="text-sm font-bold text-gray-400">{data.name}</h5>
      <ul className="ml-5 leading-10">
        {data.menuItems.map((entry, index) => (
          <Item key={index} data={entry} isLoading={isLoading} />
        ))}
      </ul>
    </div>
  ) : null;
};

export default Menu;
