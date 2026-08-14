import sequelize from "./../dbConfig/config";
import { UserModel } from "./user.js";
import { ProductModel } from "./product.js";
import { CategoriesModel } from "./category";
import { EmployeesModel } from "./Employee";
import { SupplierModel } from "./Suplliers";
import { SecretaryModel } from "./Secrtrie";
import { DelivererPersonModel } from "./DeleveryPerson";
import { OrderModel } from "./Order";
import { OrderItemModel } from "./OrderItem";
import { DayWorkModel } from "./DayWork";
import { DelivererDayWorkModel } from "./DelivererDayWork";
import {
  OrderWithDeliverie,
  OrderWithDeliverieModel,
} from "./OrderWithDeliverie";
import { RefreshTokenModel } from "./RefreshTokenModel";
import { VariantModel } from "./Variant";
import { InventorieModel } from "./Inventorie";
import { WarehouseModel } from "./Warehouse";
import { AddressModel } from "./Address";
import { CompanyModel } from "./Company";
import { VariantPriceTierModel } from "./VariantPriceTier";
import { InvoiceModel } from "./Invoice";
import { PromotionModel } from "./Promotion";
import { DiscountModel } from "./Discount";
import { InventoryMovementModel } from "./InventoryMovement";
import { InventoryAuditModel } from "./InventoryAudits";
import { InventoryReservationModel } from "./InventoryReservation";
import { InvoiceItemModel } from "./InvoiceItem";

// Initialize models
export const User = UserModel(sequelize);
export const Product = ProductModel(sequelize);
export const Category = CategoriesModel(sequelize);
export const Employee = EmployeesModel(sequelize);
export const DelivererPerson = DelivererPersonModel(sequelize);
export const Secretary = SecretaryModel(sequelize);
export const Supplier = SupplierModel(sequelize);
export const Order = OrderModel(sequelize);
export const OrderItem = OrderItemModel(sequelize);
export const DayWork = DayWorkModel(sequelize);
export const DelivererDayWork = DelivererDayWorkModel(sequelize);
export const Orderwithdeliverie = OrderWithDeliverieModel(sequelize);
export const RefreshToken = RefreshTokenModel(sequelize)
export const InvoiceItem = InvoiceItemModel(sequelize)
export const Variant = VariantModel(sequelize)
export const Inventorie  = InventorieModel(sequelize)
export const Warehouse  = WarehouseModel(sequelize) ;
export const InventoryMovement = InventoryMovementModel(sequelize);
export const InventoryAudit = InventoryAuditModel(sequelize);
export const InventoryReservation = InventoryReservationModel(sequelize);

export const Address  = AddressModel(sequelize)
export const Company = CompanyModel(sequelize);
export const VariantPriceTier = VariantPriceTierModel(sequelize)
export const Invoice = InvoiceModel(sequelize)

export const Discount = DiscountModel(sequelize)
export const Promotion = PromotionModel(sequelize)



/* =========================
  User - Company (N : 1
========================= */
Company.hasMany(User, {
   foreignKey: "companyId",
   as: "users",
 });
 
 User.belongsTo(Company, {
   foreignKey: "companyId",
   as: "company",
 });





/* =========================
   Company - Owner
========================= */

Company.belongsTo(User, {
  foreignKey: "ownerId",
  as: "owner",
});

User.hasMany(Company, {
  foreignKey: "ownerId",
  as: "ownedCompanies",
});

/* =========================
   Company - Product (1:N)
========================= */

Company.hasMany(Product, {
  foreignKey: "companyId",
  as: "products",
});

Product.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company",
});

 /* =========================
   Company - Warehouse (1 : N)


Company.hasMany(Warehouse, {
  foreignKey: {
    name: "companyId",
    allowNull: false,
  },
  as: "warehouses",

  onUpdate: "CASCADE",

  //  delete cascade ( business)
  onDelete: "RESTRICT",
});

Warehouse.belongsTo(Company, {
  foreignKey: {
    name: "companyId",
    allowNull: false,
  },
  as: "company",
});
========================= */

Company.hasMany(Warehouse, {
   foreignKey: "companyId",
   as: "warehouses",
 });
 
 Warehouse.belongsTo(Company, {
   foreignKey: "companyId",
   as: "company",
 });




 Company.hasMany(Order, {
   foreignKey: "companyId",
   as: "orders",
 });
 
 Order.belongsTo(Company, {
   foreignKey: "companyId",
   as: "company",
 });



 Company.hasMany(Order, {
   foreignKey: "buyerCompanyId",
   as: "buyerOrders",
 });
 
 Order.belongsTo(Company, {
   foreignKey: "buyerCompanyId",
   as: "buyerCompany",
 });

 Company.hasMany(Order, {
   foreignKey: "supplierCompanyId",
   as: "supplierOrders",
 });
 
 Order.belongsTo(Company, {
   foreignKey: "supplierCompanyId",
   as: "supplierCompany",
 });

/* =========================
   Order - Invoice (1 : N)
========================= */
 Order.hasOne(Invoice, {
  foreignKey: "orderId",
  as: "invoice",
});

Invoice.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});



Discount.hasMany(Promotion, {
  foreignKey: "discountId",
  as: "promotions",
});

Promotion.belongsTo(Discount, {
  foreignKey: "discountId",
  as: "discount",
});

/* =========================
   User - RefreshToken (1 : N)
========================= */
User.hasMany(RefreshToken, { foreignKey: "userId", as: "users" });
RefreshToken.belongsTo(User, { foreignKey: "userId", as: "tokens" });

/* =========================
   User - userAddress (1 : N)
========================= */

User.hasMany(Address, {
   foreignKey: "userId",
   as: "addresses",
 });

 Address.belongsTo(User, {
   foreignKey: "userId",
   as: "user",
 });

/* =========================
   Category - Product (1 : N)
========================= */
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

/* =========================
   User - Order (1 : N)
========================= */
User.hasMany(Order, { foreignKey: "customerId", as: "orders" });
Order.belongsTo(User, { foreignKey: "customerId", as: "user" });

/* =========================
   Order - OrderItem (1 : N)
========================= */
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

/* =========================
   Order - OrderWithDeliverie (1 : 1)
========================= */
Order.hasOne(OrderWithDeliverie, {
  foreignKey: "orderId",
  as: "orderwithdeliverie",
});
OrderWithDeliverie.belongsTo(Order, { foreignKey: "orderId", as: "order" });

/* =========================
   DelivererPerson - OrderWithDeliverie (1 : N)
========================= */

DelivererPerson.hasMany(OrderWithDeliverie, {
  foreignKey: "deliveryPersonId",
  as: "orderWithdeliveries",
});
OrderWithDeliverie.belongsTo(DelivererPerson, {
  foreignKey: "deliveryPersonId",
  as: "delivererPerson",
});

/* =========================

   Product - OrderItem (1 : N)
========================= */
Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });


/* =========================
   Variant - Product (N : 1)
========================= */


Product.hasMany(Variant ,{ foreignKey: "productId", as: "variants",  onDelete: "CASCADE",
   onUpdate: "CASCADE" })
Variant.belongsTo(Product ,{ foreignKey: "productId", as: "product" })



/* =========================
   Variant - Inventorie (1 : N)
========================= */

Variant.hasMany(Inventorie, {
  foreignKey: 'variantId',   
  as: 'inventories',         
  onDelete: 'CASCADE',       
  onUpdate: 'CASCADE'        
});

Inventorie.belongsTo(Variant, {
  foreignKey: 'variantId',
  as: 'variant'             
});



/* =========================
   Warehouse - Inventorie (1 : N)
========================= */



Warehouse.hasMany(Inventorie, {
  foreignKey: 'warehouseId',   
  as: 'inventories',           
  onDelete: 'CASCADE',         
  onUpdate: 'CASCADE'          
});

Inventorie.belongsTo(Warehouse, {
  foreignKey: 'warehouseId',
  as: 'warehouse'              //
});

Variant.hasMany(VariantPriceTier, {
  foreignKey: "variantId",
  as: "priceTiers",
});

VariantPriceTier.belongsTo(Variant, {
  foreignKey: "variantId",
  as: "variant",
});

/* =========================
   User - Employee (1 : 1)
========================= */
User.hasOne(Employee, { foreignKey: "userId", as: "employee" });
Employee.belongsTo(User, { foreignKey: "userId", as: "user" });

/* =========================
   Employee - DelivererPerson (1 : 1)
========================= */
Employee.hasOne(DelivererPerson, { foreignKey: "employeeId", as: "deliverer" });
DelivererPerson.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });

/* =========================
   Employee - Secretary (1 : 1)
========================= */
Employee.hasOne(Secretary, { foreignKey: "employeeId", as: "secretary" });
Secretary.belongsTo(Employee, { foreignKey: "employeeId", as: "employee" });

/* =========================
   User - Supplier (1 : 1)
========================= */
User.hasOne(Supplier, { foreignKey: "userId", as: "supplier" });
Supplier.belongsTo(User, { foreignKey: "userId", as: "user" });

/* =========================
   Deliverer - DayWork (N : N)
========================= */
DelivererPerson.belongsToMany(DayWork, {
  through: "deliverer_dayWorks",
  foreignKey: {
    name: "delivererId",
    field: "delivererid", // 
  },
  otherKey: {
    name: "dayWorkId",
    field: "dayWorkid",
  },
  as: "dayWorks",
});

DayWork.belongsToMany(DelivererPerson, {
  through: "deliverer_dayWorks",
  foreignKey: {
    name: "dayWorkId",
    field: "dayWorkid",
  },
  otherKey: {
    name: "delivererId",
    field: "delivererid",
  },
  as: "deliverers",
});


Variant.hasMany(InventoryMovement, {
  foreignKey: "variantId",
  as: "movements",
});

InventoryMovement.belongsTo(Variant, {
  foreignKey: "variantId",
  as: "variant",
});


Warehouse.hasMany(InventoryMovement, {
  foreignKey: "warehouseId",
  as: "movements",
});

InventoryMovement.belongsTo(Warehouse, {
  foreignKey: "warehouseId",
  as: "warehouse",
});



User.hasMany(InventoryMovement, {
  foreignKey: "userId",
  as: "inventoryMovements",
});

InventoryMovement.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});








// Variant -> InventoryAudits

Variant.hasMany(InventoryAudit, {
  foreignKey: "variantId",
  as: "audits",
});

InventoryAudit.belongsTo(Variant, {
  foreignKey: "variantId",
  as: "variant",
});

// Warehouse -> InventoryAudits

Warehouse.hasMany(InventoryAudit, {
  foreignKey: "warehouseId",
  as: "audits",
});

InventoryAudit.belongsTo(Warehouse, {
  foreignKey: "warehouseId",
  as: "warehouse",
});

// User -> InventoryAudits

User.hasMany(InventoryAudit, {
  foreignKey: "userId",
  as: "inventoryAudits",
});

InventoryAudit.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});


//Reservation -> Order

InventoryReservation.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
});

Order.hasMany(InventoryReservation, {
  foreignKey: "orderId",
  as: "reservations",
});

// Reservation -> Inventory
InventoryReservation.belongsTo(Inventorie, {
  foreignKey: "inventoryId",
  as: "inventory",
});

Inventorie.hasMany(InventoryReservation, {
  foreignKey: "inventoryId",
  as: "reservations",
});


//Reservation -> Warehouse

InventoryReservation.belongsTo(Warehouse, {
  foreignKey: "warehouseId",
  as: "warehouse",
});

Warehouse.hasMany(InventoryReservation, {
  foreignKey: "warehouseId",
  as: "reservations",
});

//Reservation -> Variant

// Reservation -> Variant

InventoryReservation.belongsTo(Variant, {
  foreignKey: "variantId",
  as: "variant",
});

Variant.hasMany(InventoryReservation, {
  foreignKey: "variantId",
  as: "reservations",
});

InventoryReservation.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company",
});

Company.hasMany(InventoryReservation, {
  foreignKey: "companyId",
  as: "inventoryReservations",
});

// InventoryMovement ---> Company,

Company.hasMany(InventoryMovement, {
  foreignKey: "companyId",
  as: "inventoryMovements",
});

InventoryMovement.belongsTo(Company, {
  foreignKey: "companyId",
  as: "company",
});

Warehouse.hasMany(OrderItem, {
  foreignKey: "warehouseId",
  as: "orderItems",
});

OrderItem.belongsTo(Warehouse, {
  foreignKey: "warehouseId",
  as: "warehouse",
});


/* =========================
   Invoice - InvoiceItem (1 : N)
========================= */

Invoice.hasMany(InvoiceItem, {
  foreignKey: "invoiceId",
  as: "items",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

InvoiceItem.belongsTo(Invoice, {
  foreignKey: "invoiceId",
  as: "invoice",
});


/* =========================
   Product - InvoiceItem (1 : N)
========================= */

Product.hasMany(InvoiceItem, {
  foreignKey: "productId",
  as: "invoiceItems",
});

InvoiceItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});


/* =========================
   Variant - InvoiceItem (1 : N)
========================= */

Variant.hasMany(InvoiceItem, {
  foreignKey: "variantId",
  as: "invoiceItems",
});

InvoiceItem.belongsTo(Variant, {
  foreignKey: "variantId",
  as: "variant",
});



export { sequelize };
