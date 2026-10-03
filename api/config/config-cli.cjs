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
//  import dotenv from "dotenv";
// dotenv.config();

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
  },

  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME + "_test",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME + "_prod",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
  },
};

// module.exports = {
//   development: {
//     username: process.env.DB_USER,
//     password: process.env.DDB_PASSWORD,
//     database: process.env.DB_NAME,
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT),
//     dialect: "mysql",
//   },
//   test: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME + "_test",
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT),
//     dialect: "mysql",
//   },

//   production: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME + "_prod",
//     host: process.env.DB_HOST,
//     port: Number(process.env.DB_PORT),
//     dialect: "mysql",
//   },
// };

/**
   * 
   
   Undo ONLY the last migration

   npx sequelize-cli db:migrate:undo

    npx sequelize-cli db:migrate

   All 
npx sequelize-cli migration:generate --name add-reserved-status-to-orders
npx sequelize-cli migration:generate --name add-products-company-foreign-key
   SHOW CREATE TABLE Products;

   npx sequelize-cli migration:generate --name add-warehouse-id-to-order-items
SELECT * FROM SequelizeMeta;

   ALL TRIGGER 

    Migration: Variant INSERT Trigger
 npx sequelize-cli migration:generate --name create-companies

  Best Practice Migration Names
🔵 1. Variant INSERT Trigger
   npx sequelize-cli migration:generate --name   create-trigger-prevent-variant-insert-on-simple-product
🔵 2. Variant UPDATE Trigger
 npx sequelize-cli migration:generate --name   create-trigger-prevent-variant-update-on-simple-product
🔵 3. Product UPDATE Trigger
 npx sequelize-cli migration:generate --name  create-trigger-prevent-product-type-downgrade-to-simple
🔵 4. Product DELETE Trigger
  npx sequelize-cli migration:generate --name   create-trigger-prevent-product-deletion-with-variants


  npx sequelize-cli migration:generate --name update-product-and-variant-triggers

  npx sequelize-cli db:migrate:undo:all
  companies
  npx sequelize-cli migration:generate --name create-companies
InventoryAudits
 npx sequelize-cli migration:generate --name create-InventoryAudits
InventoryReservations
 npx sequelize-cli migration:generate --name add-twoColumn-companyId-inventoryId-to-InventoryReservations

  npx sequelize-cli migration:generate --name add-companyid-to-users

  npx sequelize-cli migration:generate --name add-companyid-to-warehouses

  npx sequelize-cli migration:generate --name add-companyid-to-retailshops

  npx sequelize-cli migration:generate --name add-fields-to-orders

npx sequelize-cli migration:generate --name create-Products

//  CreateInvoices

npx sequelize-cli migration:generate --name  Create-Invoices

//Discounts

npx sequelize-cli migration:generate --name  Create-Discounts

//Promotions
npx sequelize-cli migration:generate --name  Create-Promotions


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
deliverermodule.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
  },

  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME + "_test",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
  },

  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME + "_prod",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
  },
};

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

InventoryMovements
      MODIFY COLUMN type ENUM(
        'IN',
        'OUT',
        'ADJUSTMENT',
        'TRANSFER',
        'RESERVE',
        'RELEASE'
        npx sequelize-cli migration:generate --name modify-add-enum-column-to-InventoryMovements 

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

fix users add field companyId
npx sequelize-cli migration:generate --name add-companyId-to-users

fix variantid for orderItem 
npx sequelize-cli migration:generate --name  add-variantId-to-order-items

fix companies 
 npx sequelize-cli migration:generate --name  add-company-legal-fields-and-status

soft delete 

npx sequelize-cli migration:generate --name add-soft-delete-to-products-and-variants
soft delete for Category  
npx sequelize-cli migration:generate --name add-softdelete-index-to-categories

 fix companies  table
 npx sequelize-cli migration:generate --name add-owner-id-to-companies

 trigger user with company 
   npx sequelize-cli migration:generate --name  create-before-insert-owner-trigger

   trigger update 
      npx sequelize-cli migration:generate     --name   create-before-update-owner-trigger


    npx sequelize-cli migration:generate     --name                 add_pro_fields_and_indexes_to_inventory_movements

                npx sequelize-cli migration:generate     --name          fix-inventories-integrity-safe
 

                companyId 
                npx sequelize-cli migration:generate --name add-company-id-to-products

                npx sequelize-cli migration:generate --name add-companyId-to-inventory-movements


                InventoryReservations', 'orderItemId',

                                npx sequelize-cli migration:generate --name add-orderItemId-to-InventoryReservations

                                 npx sequelize-cli migration:generate --name    add-sale-to-inventory-movements-type

                                 InvoiceItems

                                 npx sequelize-cli migration:generate --name create-InvoiceItems

                                 npx sequelize-cli migration:generate --name add-status-to-invoices

sudo /opt/lampp/lampp start
Starting XAMPP for Linux...
XAMPP: Starting Apache...
XAMPP: Starting MySQL...
XAMPP: Starting ProFTPD...


sudo /opt/lampp/bin/mysql -u root -p

// refresh network 
sudo systemctl restart NetworkManager


nmcli radio wifi off
nmcli radio wifi on


📡 3. Rescan available networks
nmcli device wifi rescan
nmcli device wifi list

👉 Useful if your Wi-Fi network is not showing.

🔌 4. Reconnect to a specific network
nmcli connection up "YOUR_WIFI_NAME"



open  maria db 

 docker compose exec api npx sequelize-cli migration:generate --name  create-company-settings
docker compose exec api npx sequelize-cli migration:generate --name add-chk-superadmin-company

docker compose exec api npx sequelize-cli db:migrate

docker compose exec app npx sequelize-cli migration:generate --name add-chk-companyAdmin-Owner-required

   Docker Compose: build → start → check services،  3 commands:

docker compose build
docker compose up -d
docker compose ps
بالترتيب

1️⃣ Build images

docker compose build

2️⃣ Start containers in background

docker compose up -d

3️⃣ Check running services

docker compose ps


docker compose exec api npx sequelize-cli db:migrate:status


docker exec -it ecommerce-mariadb mariadb -u root -prootpassword



case: تأكد أن الملف ما يتبعثش لـ Git
bash
git ls-files | grep env.docker

// $2b$10$XZ68pTsYxgi1BmUAhMIwRuV0XhG8fpvLhL2nReklpbHDsXVyActrq

UPDATE Users
SET password = '$2b$10$XZ68pTsYxgi1BmUAhMIwRuV0XhG8fpvLhL2nReklpbHDsXVyActrq',
    updatedAt = NOW()
WHERE id = 3
  AND email = 'ownernader@email.com'
  AND role = 'OWNER';




UPDATE Users
SET password = '$2b$10$XZ68pTsYxgi1BmUAhMIwRuV0XhG8fpvLhL2nReklpbHDsXVyActrq',
    updatedAt = NOW()
WHERE id = 11
  AND email = 'ownernader2@email.com'
  AND role = 'OWNER';


curl -i \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hZGVyYWRtaW5AdGVzdC5jb20iLCJyb2xlIjoiQURNSU4iLCJpZCI6MiwiY29tcGFueUlkIjoxLCJpYXQiOjE3OTA5ODE1NzksImV4cCI6MTc5MTAwNjc3OX0.tRfn-xZDxSgVK51Agj0MgEpN6W8pP_-zH5c-9I5yZ4s" \
  http://localhost:4000/api/company/settings

NODE_OPTIONS="--max-old-space-size=4096" npm install --network-timeout=1000000

owner 2 
curl -i \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im93bmVybmFkZXIyQGVtYWlsLmNvbSIsInJvbGUiOiJPV05FUiIsImlkIjoxMSwiY29tcGFueUlkIjoyLCJpYXQiOjE3OTEwMTMzMzcsImV4cCI6MTc5MTAzODUzN30.91h1QvoYe3xcehcZrq5OFwKZ-_aKP9NIUDIRs3_bnFM" \
  http://localhost:4000/api/company/settings



token owner 1 
  curl -i "http://localhost:4000/api/company/settings?companyId=2" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im93bmVybmFkZXJAZW1haWwuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWQiOjMsImNvbXBhbnlJZCI6MSwiaWF0IjoxNzkxMDE0MjcwLCJleHAiOjE3OTEwMzk0NzB9.-tvcvpxeunkFtLXJZFJ8ii03mn6mwznHJemCTaS_TyI"



  updated 

  curl -i -X PUT http://localhost:4000/api/company/settings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im93bmVybmFkZXJAZW1haWwuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWQiOjMsImNvbXBhbnlJZCI6MSwiaWF0IjoxNzkxMDE0MjcwLCJleHAiOjE3OTEwMzk0NzB9.-tvcvpxeunkFtLXJZFJ8ii03mn6mwznHJemCTaS_TyI" \
  -H "Content-Type: application/json" \
  -d '{
    "currency": "EUR",
    "language": "en"
  }'

 YOUR_COMPANY_1_OWNER_TOKEN
  curl -i -X PUT http://localhost:4000/api/company/settings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im93bmVybmFkZXJAZW1haWwuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWQiOjMsImNvbXBhbnlJZCI6MSwiaWF0IjoxNzkxMDE0MjcwLCJleHAiOjE3OTEwMzk0NzB9.-tvcvpxeunkFtLXJZFJ8ii03mn6mwznHJemCTaS_TyI" \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": 2,   
    "currency": "USD",
    "language": "ar"
  }'


  Then use your Company 2 OWNER token:

curl -s http://localhost:4000/api/company/settings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im93bmVybmFkZXIyQGVtYWlsLmNvbSIsInJvbGUiOiJPV05FUiIsImlkIjoxMSwiY29tcGFueUlkIjoyLCJpYXQiOjE3OTEwMjc2MTcsImV4cCI6MTc5MTA1MjgxN30.WO0zmE3Reo6kLlu6wo6-U9tH51B7X7pKeaMYnBvVHMw"



  curl -i -X PUT http://localhost:4000/api/company/settings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im93bmVybmFkZXJAZW1haWwuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWQiOjMsImNvbXBhbnlJZCI6MSwiaWF0IjoxNzkxMDI3OTQ3LCJleHAiOjE3OTEwNTMxNDd9.mqf4zRGLIbClficApX_wbdKnJAWTlO-6s07P0KgRJjg" \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": 2,
    "currency": "USD",
    "language": "ar"
  }'



  curl -i http://localhost:4000/api/company/settings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im93bmVybmFkZXIyQGVtYWlsLmNvbSIsInJvbGUiOiJPV05FUiIsImlkIjoxMSwiY29tcGFueUlkIjoyLCJpYXQiOjE3OTEwMjc2MTcsImV4cCI6MTc5MTA1MjgxN30.WO0zmE3Reo6kLlu6wo6-U9tH51B7X7pKeaMYnBvVHMw"


  owner1 
curl -i -X PUT http://localhost:4000/api/company/settings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im93bmVybmFkZXJAZW1haWwuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWQiOjMsImNvbXBhbnlJZCI6MSwiaWF0IjoxNzkxMDE0MjcwLCJleHAiOjE3OTEwMzk0NzB9.-tvcvpxeunkFtLXJZFJ8ii03mn6mwznHJemCTaS_TyI" \
  -H "Content-Type: application/json" \
  -d '{
    "currency": "EUR",
    "language": "en",
    "taxRate": 19
  }'



curl -i -X PUT http://localhost:4000/api/company/settings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im93bmVybmFkZXJAZW1haWwuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWQiOjMsImNvbXBhbnlJZCI6MSwiaWF0IjoxNzkxMDE0MjcwLCJleHAiOjE3OTEwMzk0NzB9.-tvcvpxeunkFtLXJZFJ8ii03mn6mwznHJemCTaS_TyI" \
  -H "Content-Type: application/json" \
  -d '{
     "currency": "EUR",
  "language": "en",
  "taxRate": "19.00"
  }'

curl -i -X PUT http://localhost:4000/api/company/settings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im93bmVybmFkZXJAZW1haWwuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWQiOjMsImNvbXBhbnlJZCI6MSwiaWF0IjoxNzkxMDE0MjcwLCJleHAiOjE3OTEwMzk0NzB9.-tvcvpxeunkFtLXJZFJ8ii03mn6mwznHJemCTaS_TyI" \
  -H "Content-Type: application/json" \
  -d '{
    "currency": "INVALID"
  }'
  

  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im93bmVybmFkZXJAZW1haWwuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWQiOjMsImNvbXBhbnlJZCI6MSwiaWF0IjoxNzkxMDE0MjcwLCJleHAiOjE3OTEwMzk0NzB9.-tvcvpxeunkFtLXJZFJ8ii03mn6mwznHJemCTaS_TyI

curl -i -X PUT http://localhost:4000/api/company/settings \
  -H "Authorization: Bearer   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im93bmVybmFkZXJAZW1haWwuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWQiOjMsImNvbXBhbnlJZCI6MSwiaWF0IjoxNzkxMDE0MjcwLCJleHAiOjE3OTEwMzk0NzB9.-tvcvpxeunkFtLXJZFJ8ii03mn6mwznHJemCTaS_TyI" \
  -H "Content-Type: application/json" \
  -d '{
    "taxRate": 150
  }'


curl -i -X PUT http://localhost:4000/api/company/settings \
  -H "Authorization: Bearer   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im93bmVybmFkZXJAZW1haWwuY29tIiwicm9sZSI6Ik9XTkVSIiwiaWQiOjMsImNvbXBhbnlJZCI6MSwiaWF0IjoxNzkxMDE0MjcwLCJleHAiOjE3OTEwMzk0NzB9.-tvcvpxeunkFtLXJZFJ8ii03mn6mwznHJemCTaS_TyI" \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": 2,
    "currency": "USD"
  }'


  admin 
  curl -i -X PUT http://localhost:4000/api/company/settings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5hZGVyYWRtaW5AdGVzdC5jb20iLCJyb2xlIjoiQURNSU4iLCJpZCI6MiwiY29tcGFueUlkIjoxLCJpYXQiOjE3OTEwMzQyOTIsImV4cCI6MTc5MTA1OTQ5Mn0.5l7p-Baq02MqOZXLA-sFnaQaiCGWsEGCxN-Bfgwbt34" \
  -H "Content-Type: application/json" \
  -d '{
    "currency": "TND",
    "language": "fr",
    "taxRate": 19
  }'




  superadmin token 
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cGVyYWRtaW5AdGVzdC5jb20iLCJyb2xlIjoiU1VQRVJBRE1JTiIsImlkIjo1LCJjb21wYW55SWQiOm51bGwsImlhdCI6MTc5MTAzNDcxNCwiZXhwIjoxNzkxMDU5OTE0fQ.w8IrghxUrCH9uI_gCKrrAB84GHVcaLYapNR2M1-_gkQ


  curl -i -X PUT http://localhost:4000/api/company/settings \
  -H "Authorization: Bearer   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cGVyYWRtaW5AdGVzdC5jb20iLCJyb2xlIjoiU1VQRVJBRE1JTiIsImlkIjo1LCJjb21wYW55SWQiOm51bGwsImlhdCI6MTc5MTAzNDcxNCwiZXhwIjoxNzkxMDU5OTE0fQ.w8IrghxUrCH9uI_gCKrrAB84GHVcaLYapNR2M1-_gkQ
" \
  -H "Content-Type: application/json" \
  -d '{
    "currency": "USD"
  }'

  3. Now test SUPERADMIN

استعمل SUPERADMIN token الذي اختبرناه سابقاً:

  curl -i http://localhost:4000/api/platform/test \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cGVyYWRtaW5AdGVzdC5jb20iLCJyb2xlIjoiU1VQRVJBRE1JTiIsImlkIjo1LCJjb21wYW55SWQiOm51bGwsImlhdCI6MTc5MTAzNDcxNCwiZXhwIjoxNzkxMDU5OTE0fQ.w8IrghxUrCH9uI_gCKrrAB84GHVcaLYapNR2M1-_gkQ"



curl -i http://localhost:4000/api/companies \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cGVyYWRtaW5AdGVzdC5jb20iLCJyb2xlIjoiU1VQRVJBRE1JTiIsImlkIjo1LCJjb21wYW55SWQiOm51bGwsImlhdCI6MTc5MTAzNDcxNCwiZXhwIjoxNzkxMDU5OTE0fQ.w8IrghxUrCH9uI_gCKrrAB84GHVcaLYapNR2M1-_gkQ"



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









                 Authentication
                       │
                       ▼
                 User Identity
                       │
              ┌────────┴────────┐
              ▼                 ▼
             Role          companyId
              │                 │
              ▼                 ▼
         Permissions       Tenant Scope
              │                 │
              └────────┬────────┘
                       ▼
                 Resource Policy
                       │
                       ▼
                    ALLOW/DENY


   */
