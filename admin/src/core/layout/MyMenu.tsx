import { useState, useEffect } from "react";
import { Menu } from "react-admin";
import { useLocation } from "react-router-dom";

import PeopleIcon from "@mui/icons-material/People";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import StoreIcon from "@mui/icons-material/Store";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import BusinessIcon from "@mui/icons-material/Business";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const MyMenu = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (
      location.pathname.includes("shippers") ||
      location.pathname.includes("deliverers") ||
      location.pathname.includes("suppliers")
    ) {
      setOpen(true);
    }
  }, [location]);

  return (
    <Menu>
      <Menu.Item to="/" primaryText="Dashboard" leftIcon={<DashboardIcon />} />

      <Menu.Item
        to="/companies"
        primaryText="Companies"
        leftIcon={<BusinessIcon />}
      />
         <Menu.Item
        to="/owners"
        primaryText="Company Owners"
        leftIcon={<BusinessIcon />}
      />

      <Menu.Item
        to="/warehouses"
        primaryText="WareHouses"
        leftIcon={<WarehouseIcon />}
      />
      <Menu.Item
        to="/inventories"
        primaryText="Inventory"
        leftIcon={<Inventory2Icon />}
      />

      <Menu.Item to="/users" primaryText="Users" leftIcon={<GroupIcon />} />

      {/* Employees Dropdown */}
      <ListItemButton
        onClick={handleClick}
        sx={{
          pl: 2,
          borderRadius: 2,
          mx: 1,
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>

        <ListItemText primary="Employees" />

        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Menu.Item
          to="/shippers"
          primaryText="Shippers"
          leftIcon={<LocalShippingIcon />}
          sx={{ pl: 4 }}
        />

        <Menu.Item
          to="/deliverers"
          primaryText="Deliverers"
          leftIcon={<DeliveryDiningIcon />}
          sx={{ pl: 4 }}
        />

        <Menu.Item
          to="/suppliers"
          primaryText="Suppliers"
          leftIcon={<StoreIcon />}
          sx={{ pl: 4 }}
        />
      </Collapse>

      <Menu.Item
        to="/usersAddress"
        primaryText="Addresses"
        leftIcon={<HomeIcon />}
      />



      <Menu.Item
        to="/categories"
        primaryText="Categories"
        leftIcon={<CategoryIcon />}
      />
      <Menu.Item
        to="/products"
        primaryText="Products"
        leftIcon={<StoreIcon />}
      />

      <Menu.Item
        to="/orders"
        primaryText="Orders"
        leftIcon={<ShoppingCartIcon />}
      />


      <Menu.Item to="/days" primaryText="Days" leftIcon={<ViewWeekIcon />} />
    </Menu>
  );
};

export default MyMenu;
