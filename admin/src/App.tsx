import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Admin, Resource } from "react-admin";

import authProvider from "./core/providers/authProvider";

import Dashboard from "./dashboard/Dashboard";

import { RegisterPage } from "./auth/pages/RegisterPage";
import { LoginPage } from "./auth/pages/LoginPage";
import MyLayout from "./core/layout/MyLayout";
import themes from "./modules/themes";
import dataProvider from "./core/providers/dataProvider";

import { EditCategorie, ListCategories } from "./modules/categories";
import { CreateUser, EditUser, ListUsers } from "./modules/users";
import { ListWeekDays, CreateWeekDay } from "./modules/weekDay";
import { CreateProduct, ListProducts } from "./modules/products";
import { CreateUserAddress, EditUserAddress, ListUserAddress, ShowUserAddress } from "./modules/userAddress";
import { CreateCompany, EditCompany, ListCompany, ShowCompany } from "./modules/company";
import ListWareHouses from "./modules/WareHouses/ListWareHouses";
import CreateWareHouse from "./modules/WareHouses/CreateWareHouse";
import EditWareHouse from "./modules/WareHouses/EditWareHouse";
import ShowWareHouse from "./modules/WareHouses/ShowWareHouse";
import { ListInventorie } from "./modules/Inventory/ListInventorie";
import { ShowInventorie } from "./modules/Inventory/ShowInventorie";
import { EditInventorie } from "./modules/Inventory/EditInventorie";
import { CreateInventorie } from "./modules/Inventory/CreateInventorie";
import { CreateVariant } from './modules/variantProduct/CreateVariant';



const App = () => {



  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <Admin
            dataProvider={dataProvider}
              authProvider={authProvider}
             dashboard={Dashboard}
             layout={MyLayout}
             {...themes}
            >
          

          <Resource
      name="companies"
      list={ListCompany}
      create={CreateCompany}
      edit={EditCompany}
      show={ShowCompany}
    />

<Resource
      name="inventories"
      list={ListInventorie}
      create={CreateInventorie}
      edit={EditInventorie}
      show={ShowInventorie}
    />

<Resource
      name="warehouses"
      list={ListWareHouses}
      create={CreateWareHouse}
      edit={EditWareHouse}
      show={ShowWareHouse}
    />
          <Resource
    name="users"
    list={ListUsers}
    create={CreateUser}
    edit={EditUser}
   // show={showUser}
  />

<Resource
    name="usersAddress"
    list={ListUserAddress}
   create={CreateUserAddress}
   show={ShowUserAddress}
   edit={EditUserAddress}
  
   // show={showUser}
  />
 <Resource
    name="categories" 
    //categories
    list={ListCategories}
    edit={EditCategorie}
    
  /> 

 {/* <Resource
    name="days" 
    //days
     list={ListWeekDays}
     create={CreateWeekDay}
    
  />   */}

  <Resource  name="products"
    create={CreateProduct}
  list={ListProducts}
  />

<Resource
  name="variants"
  create={CreateVariant}
/>
              <Resource name="dashboard"  />
            </Admin>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;