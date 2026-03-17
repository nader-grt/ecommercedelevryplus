
import { sequelize } from "./models/main.js";
import express from "express";
import { corsOptions } from "./corsConfig/corsConfig.js";
import cors from "cors";
import cookieParser from "cookie-parser";

//user managment
import getUserByAdminRoutes from "./routes/userRoutes/GetUserByAdminRoute.js"
import getProfileUserRoutes from "./routes/userRoutes/GetProfileUserRoute.js"
import getAllUserRoutes from "./routes/userRoutes/GetAllUserByRoleRoute.js"
import deleteUserRoutes from "./routes/userRoutes/DeleteUserRoute.js"
import updateUserByAdminRoutes from "./routes/userRoutes/UpdateUserByAdminRoute.js"
import updateProfileUserRoutes from "./routes/userRoutes/UpdateProfileUserRoute.js"
import mailRoutes from "./routes/userRoutes/sendUserMailRoute.js";

// userAddress 

import createUserAddressByAdminRoutes from "./routes//userAddressRoute/CreateUserAddressByAdminUserRoute.js"
import listUserAddressRoutes from "./routes/userAddressRoute/ListUserAddressByAdminUserRoute.js"
import deleteUserAddressRoutes from "./routes/userAddressRoute/DeleteUserAddressByAdminRoute.js"
import updateUserAddressRoutes from "./routes/userAddressRoute/UpdateUserAddressByAdminUserRoute.js"

// product  
import createProductRoute from "./routes/productRoutes/createProductRoute.js";
import updateProductRoute from "./routes/productRoutes/updateProductRoute.js";
import getProductRandomRoute from "./routes/productRoutes/GetProductRandomRoute.js";
import getProductByCategoryRoute from "./routes/productRoutes/GetProductByCategoryRoute.js";
import getProductRoute from "./routes/productRoutes/GetProductRoute.js";
import getAllProductByCategoryIdRoute from "./routes/productRoutes/GetAllProductsFiltredByCategoryIdRoute.js";


//category
import createCategoryRoute from "./routes//categoryRoute/createCategoryRoute.js";
import deleteCategoryRoute from "./routes//categoryRoute/DeleteCategoryRoute.js";
import updateCategoryRoute from "./routes//categoryRoute/UpdateCategoryRoute.js";
import getCategoryRoute from "./routes//categoryRoute/GetCategoryRoute.js";
import getAllCategoryRoute from "./routes//categoryRoute/GetAllCategoryRoute.js";

//user
import registerRoute from "./routes/authRoute/registerUserRoute.js";
import loginRoute from "./routes/authRoute/loginUserRoute.js";
import logoutRoute from "./routes/authRoute/logoutUserRoute.js";
import refreshTokenRoute from "./routes/authRoute/RefreshTokenRoute.js";


import createEmployeeRoute from  "./routes/EmployeeRoute/CreateEmployeeRoute.js"
import getEmployeeRoute from  "./routes/EmployeeRoute/GetEmployeeRoute.js"
import updateEmployeeRoute from  "./routes/EmployeeRoute/UpdateEmployeeRoute.js"
import deleteEmployeeRoute from  "./routes/EmployeeRoute/DeleteEmployeeRoute.js"

import createdeleryRoute from  "./routes/DelevryRoute/CreateDelevryRoute.js"
import updatedeleryRoute from  "./routes/DelevryRoute/UpdateDelevryRoute.js"
import deletedeleryRoute from  "./routes/DelevryRoute/DeleteDelevryRoute.js"
import getdeleryRoute from  "./routes/DelevryRoute/GetDelevryRoute.js"


import createSupplierRoute from  "./routes/SupplierRoute/CreateSupplierRoute.js"
import updateSupplierRoute from  "./routes/SupplierRoute/UpdateSupplierRoute..js"
import deleteSupplierRoute from  "./routes/SupplierRoute/DeleteSupplierRoute..js"
import getSupplierRoute from  "./routes/SupplierRoute/GetSupplierRoute.js"

//Secretary


import createSecretaryRoute from  "./routes/SecretaryRoute/CreateSecretaryRoute.js"
import updateSecretaryRoute from  "./routes/SecretaryRoute/UpdateSecretaryRoute.js"
import deleteSecretaryRoute from  "./routes/SecretaryRoute/GetSecretaryRoute.js"
import getSecretaryRoute from  "./routes/SecretaryRoute/GetSecretaryRoute.js"


import createDelivererDayWorkRoute from  "./routes/DeleveryWithDaysWorkRoute/CreateDelivererDayWorkRoute.js"
import updateDelivererDayWorkRoute from  "./routes/DeleveryWithDaysWorkRoute/UpdateDelivererDayWorkRoute.js"
import deleteDelivererDayWorkRoute from  "./routes/DeleveryWithDaysWorkRoute/DeleteDelivererDayWorkRoute.js"
import getDelivererDayWorkRoute from  "./routes/DeleveryWithDaysWorkRoute/GetDelivererDayWorkRoute.js"

//order 

import createOrderRoute from  "./routes/OrderRoute/CreateOrderRoute.js"
import createOrderCustmorRoute from  "./routes/OrderRoute/CreateOrderCustmerRoute.js"
import updateOrderRoute from  "./routes/OrderRoute/UpdateOrderRoute.js"
import deleteOrderRoute from  "./routes/OrderRoute/DeleteOrderRoute.js"
import getOrderRoute from  "./routes/OrderRoute/GetOrderRoute.js"
import cancelOrderByUserRoute from  "./routes/OrderRoute/CancelOrderByUserRoute.js"
import payOrderByUserRoute from  "./routes/OrderRoute/PayOrderRoute.js"
import shipOrderRoute from  "./routes/OrderRoute/ShipOrderRoute.js"

// OrderWithDeliveries

import assignDeliveryRoute from  "./routes/OrderWithDeliveriesRoute/AssignDeliveryRoute.js"
import cancelDeliveryOrder from  "./routes/OrderWithDeliveriesRoute/CancelDeliveryOrderRoute.js"
import startDeliveryOrderRoute from  "./routes/OrderWithDeliveriesRoute/StartDeliveryOrderRoute.js"
import completeDeliveryOrderRoute from  "./routes/OrderWithDeliveriesRoute/completeDeliveryOrderRoute.js"






import createDayWorkRoute from "./routes/DayWorkRoute/CreateWorkDayRoute.js"
import getDayWorkRoute from "./routes/DayWorkRoute/GetWorkDayRoute.js"
import { folderPath } from "./filesystem/fileHandle.js";

const app = express();

// Middleware
app.use(express.json());



app.use(cors(corsOptions));
app.use(cookieParser());

// user + profile
app.use("/api", getUserByAdminRoutes);
app.use("/api", getProfileUserRoutes);
app.use("/api", getAllUserRoutes);
app.use("/api", updateUserByAdminRoutes);
app.use("/api",updateProfileUserRoutes)
app.use("/api", deleteUserRoutes);


// userAddress managment


app.use("/api", createUserAddressByAdminRoutes);
app.use("/api", listUserAddressRoutes);
app.use("/api", deleteUserAddressRoutes);
app.use("/api", updateUserAddressRoutes);

app.use("/apimail", mailRoutes);

// product  + static images 
app.use("/images", express.static(folderPath));
app.use("/api",createProductRoute)  ;
app.use("/api",updateProductRoute)  ;
app.use("/api",getProductRandomRoute)  ;
app.use("/api",getProductByCategoryRoute)  ;
app.use("/api",getProductRoute)  ;
app.use("/api",getAllProductByCategoryIdRoute) ;








//employee 
app.use("/api",createEmployeeRoute)  ;
app.use("/api",getEmployeeRoute)  ;
app.use("/api",updateEmployeeRoute) ;
app.use("/api",deleteEmployeeRoute)

// delevry  createdeleryRoute
app.use("/api",createdeleryRoute)  ;
app.use("/api",updatedeleryRoute)  ;
app.use("/api",deletedeleryRoute)  ;
app.use("/api",getdeleryRoute)  ;

//Supplier 

app.use("/api",createSupplierRoute)  ;
app.use("/api",updateSupplierRoute)  ;
app.use("/api",deleteSupplierRoute)  ;
app.use("/api",getSupplierRoute)  ;

// category
app.use("/api",createCategoryRoute)  ;
app.use("/api",deleteCategoryRoute)  ;
app.use("/api",updateCategoryRoute)  ;
app.use("/api",getCategoryRoute)  ;
app.use("/api",getAllCategoryRoute)

//DelivererDayWork
app.use("/api",createDelivererDayWorkRoute)  ;
app.use("/api",updateDelivererDayWorkRoute)  ;
app.use("/api",deleteDelivererDayWorkRoute)  ;
app.use("/api",getDelivererDayWorkRoute)  ;

//secretary 
app.use("/api",createSecretaryRoute)  ;
app.use("/api",updateSecretaryRoute)  ;
app.use("/api",deleteSecretaryRoute)  ;
app.use("/api",getSecretaryRoute)  ;


//dayworking 

app.use("/api",createDayWorkRoute)  ;
app.use("/api",getDayWorkRoute)  ;




//Secretary


//order 

app.use("/api",createOrderRoute)  ;
app.use("/api",updateOrderRoute)  ;
app.use("/api",deleteOrderRoute)  ;
app.use("/api",getOrderRoute)  ;
app.use("/api",createOrderCustmorRoute)  ;
app.use("/api",cancelOrderByUserRoute);
app.use("/api",payOrderByUserRoute)
app.use("/api",shipOrderRoute)

// DeliveryOrder


app.use("/api",assignDeliveryRoute)  ;
app.use("/api",cancelDeliveryOrder)  ;
app.use("/api",startDeliveryOrderRoute)  ;
app.use("/api",completeDeliveryOrderRoute)  ;

//auth  with user 

app.use("/api", registerRoute)  ;
app.use("/api",loginRoute)  ;
app.use("/api",logoutRoute)  ;
app.use("/api",refreshTokenRoute)



// Port
const PORT = 4000;


async function startServer() {
  try {
  
    await sequelize.authenticate();
    console.log("Database connected");

  
    await sequelize.sync();
    console.log("Database synced");

   
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1); 
  }
}

(async () => {
  await startServer();
})();
