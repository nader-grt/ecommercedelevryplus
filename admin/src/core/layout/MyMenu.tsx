import { Menu } from "react-admin";

const MyMenu = () => (
  <Menu>
    <Menu.Item to="/" primaryText="Dashboard" />
    <Menu.Item to="/users" primaryText="Users" />

    <Menu.Item to="/products" primaryText="ProductsByCategory" />
    <Menu.Item to="/orders" primaryText="Orders" />
   
    <Menu.Item to="/categories" primaryText="Categories" />
    <Menu.Item to="/days" primaryText="DaysInWeek" />
  </Menu>
);

export default MyMenu;
