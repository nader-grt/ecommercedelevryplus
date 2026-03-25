// config/config-cli.cjs
// module.exports = {
//     development: {
//       username: "root",
//       password: "",
//       database: "ecommercedelevry",
//       host: "127.0.0.1",
//       port: 3307,
//       dialect: "mysql"    
//     }
//   };
  

// config/config-cli.cjs
import dotenv from "dotenv";
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
  },

};

  /**
   * 
   
   Undo ONLY the last migration

   npx sequelize-cli db:migrate:undo

    npx sequelize-cli db:migrate

   All 
  

   ALL TRIGGER 

    Migration: Variant INSERT Trigger
 npx sequelize-cli migration:generate --name create-companies

 🚀 ✅ Best Practice Migration Names
🔵 1. Variant INSERT Trigger
   npx sequelize-cli migration:generate --name   create-trigger-prevent-variant-insert-on-simple-product
🔵 2. Variant UPDATE Trigger
 npx sequelize-cli migration:generate --name   create-trigger-prevent-variant-update-on-simple-product
🔵 3. Product UPDATE Trigger
 npx sequelize-cli migration:generate --name  create-trigger-prevent-product-type-downgrade-to-simple
🔵 4. Product DELETE Trigger
  npx sequelize-cli migration:generate --name   create-trigger-prevent-product-deletion-with-variants


  npx sequelize-cli db:migrate:undo:all
  companies
  npx sequelize-cli migration:generate --name create-companies

  npx sequelize-cli migration:generate --name add-companyid-to-users

  npx sequelize-cli migration:generate --name add-companyid-to-warehouses

  npx sequelize-cli migration:generate --name add-companyid-to-retailshops

  npx sequelize-cli migration:generate --name add-fields-to-orders

npx sequelize-cli migration:generate --name create-Products

//VariantPriceTiers

npx sequelize-cli migration:generate --name create-VariantPriceTiers

// fix table Products type 
npx sequelize-cli migration:generate --name fix-Products-Simple-Variable


//RefreshTokens
npx sequelize-cli migration:generate --name create-RefreshTokens

npx sequelize-cli migration:generate --name create-Categories
//categories  npx sequelize-cli db:migrate:undo:all


npx sequelize-cli migration:generate --name create-Employees

//
deliverer

npx sequelize-cli migration:generate --name create-deliverers

//SECRITRY
npx sequelize-cli migration:generate --name create-secrtries
//supllier
npx sequelize-cli migration:generate --name create-suplliers


//order

npx sequelize-cli migration:generate --name create-orders


//settings

npx sequelize-cli migration:generate --name create-setting


OrderItems

npx sequelize-cli migration:generate --name create-OrderItems


dayWorks

npx sequelize-cli migration:generate --name create-dayWorks

dayWorks

npx sequelize-cli migration:generate --name create-dayWorks


deliverersdayWorks

npx sequelize-cli migration:generate --name create-deliverersdayWorks

secrtries

npx sequelize-cli migration:generate --name create-secrtriesdayWorks

variants

npx sequelize-cli migration:generate --name create-Variants


npx sequelize-cli migration:generate --name add-users-email-unique-constraint



Warehouses

npx sequelize-cli migration:generate --name create-Warehouses

Inventory

npx sequelize-cli migration:generate --name create-Inventories

InventoryMovements

npx sequelize-cli migration:generate --name create-InventoryMovements

//phone 
npx sequelize-cli migration:generate --name create-phones
Addressusers
npx sequelize-cli migration:generate --name create-addresses 
OrderAddresses
npx sequelize-cli migration:generate --name create-OrderAddresses 
remove address remove city 
npx sequelize-cli migration:generate --name remove-city-address-from-users


view 
npx sequelize-cli migration:generate --name create-deliverer-work-days-view


//  create indexes for remove duplicate and table middlke deliverer_dayWorks
npx sequelize-cli migration:generate --name add-unique-to-deliverer-dayworks

// add column orderitems 

npx sequelize-cli migration:generate --name alter_orderitems_add_columns

remove column
npx sequelize-cli migration:generate --name remove-totalPrice-from-orderitems

// add constrain unique_order_product
npx sequelize-cli migration:generate --name add-constrain_unique_order_product-from-orderitems
//deliveryorder
//add champ for DeliverieOrders
npx sequelize-cli migration:generate --name add-champ_DeliverieOrders-timesstamp

npx sequelize-cli migration:generate --name create-deliverieswithorder-table


 Retail Shops
npx sequelize-cli migration:generate --name create-RetailShops
 Shop ↔ Warehouses (Pivot Table)
npx sequelize-cli migration:generate --name create-ShopWarehouses
 Inventory Reservations
npx sequelize-cli migration:generate --name create-InventoryReservations
run  xampp  

add cascade 
npx sequelize-cli migration:generate --name add-cascade-to-variants-productid
Channels

npx sequelize-cli migration:generate --name create-Channels
SKUstable
npx sequelize-cli migration:generate --name create-tableSkus


removunique address fror user 
npx sequelize-cli migration:generate --name remove-unique-from-userId-address


Fix 
npx sequelize-cli migration:generate --name fix-user-address-relation

fixed userAddress 
npx sequelize-cli migration:generate --name add-city-country-to-userAddresses

fix Setting 
npx sequelize-cli migration:generate --name add-settings-missing-fields



sudo /opt/lampp/lampp start
Starting XAMPP for Linux...
XAMPP: Starting Apache...
XAMPP: Starting MySQL...
XAMPP: Starting ProFTPD...




open  maria db 


sudo /opt/lampp/bin/mysql -u root -p


NODE_OPTIONS="--max-old-space-size=4096" npm install --network-timeout=1000000


npm install --ignore-scripts

killall -9 node
rm -rf node_modules package-lock.json

rm -rf node_modules package-lock.json
npm cache clean --force
or  



 createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },







        test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME + "_test",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME + "_prod",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
  },

   */