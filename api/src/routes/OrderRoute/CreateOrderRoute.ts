// import { Request, Response, Router } from "express";
// import OrderRepo from "../../repo/OrderRepo/OrderRepo";
// import CreateOrderUseCase from "../../useCases/OrderUsecase/CreateOrderByUserUseCase";
// import CreateOrderController from "../../controllers/Orders/CreateOrderByUserController";
// import { verifyToken } from "../../middleware/verifyToken";
// import { userRepo } from "../../repo/auth/userRepo/userRepo";
// import CreateOrderByAdminController from "../../controllers/Orders/CreateOrderByAdminController";
// import CreateOrderByAdminUseCase from "../../useCases/OrderUsecase/CreateOrderByAdminUseCase";
// import ProductRepo from "../../repo/productRepo/productRepo";
// import GetCompanyOwnersUseCase from "../../useCases/companyUseCase/GetCompanyOwnersUseCase";

// const router = Router();

// const userepo = new userRepo();
// const orderepo = new OrderRepo();
// const productrepo = new ProductRepo();
// const getCompanyOwnersUseCase  = new  GetCompanyOwnersUseCase(new userRepo());

// const createOrderUseCase = new CreateOrderByAdminUseCase(
//   userepo,
//   orderepo,
//   productrepo,
//   getCompanyOwnersUseCase
// );

// const createOrderByAdminRoute = new CreateOrderByAdminController(
//   createOrderUseCase
// );

// admin




import { Request, Response, Router } from "express";
import OrderRepo from "../../repo/OrderRepo/OrderRepo";
import { verifyToken } from "../../middleware/verifyToken";
import { userRepo } from "../../repo/auth/userRepo/userRepo";

import CreateOrderByAdminController from "../../controllers/Orders/CreateOrderByAdminController";
import CreateOrderByAdminUseCase from "../../useCases/OrderUsecase/CreateOrderByAdminUseCase";

import ProductRepo from "../../repo/productRepo/productRepo";
import GetCompanyOwnersUseCase from "../../useCases/companyUseCase/GetCompanyOwnersUseCase";

import ReserveStockUseCase from "../../useCases/InventorieUseCase/ReserveStockUseCase";
import GenerateInvoiceUseCase from "../../useCases/InvoiceUseCase/GenerateInvoiceUseCase";

import sequelize from "../../dbConfig/config";
import InvoiceRepo from "../../repo/InvoiceRepo/InvoiceRepo";
import InvoiceService from "../../services/InvoiceService/InvoiceService";
import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import InventoryMovementRepo from "../../repo/MovementRepo/InventoryMovementRepo";
import InventoryReservationRepo from "../../repo/InventoryReservationRepo/InventoryReservationRepo";
import InventoryAuditRepo from "../../repo/InventoryAuditRepo/InventoryAuditRepo";
import ResolveWarehouseForItemService from "../../services/InventoryService/ResolveWarehouseForItemService";

const router = Router();

// ======================================================
// Repositories
// ======================================================

const userRepoInstance = new userRepo();
const orderRepoInstance = new OrderRepo();
const productRepoInstance = new ProductRepo();

const invoiceRepo  = new InvoiceRepo()
const inventorieRepo  = new InventorieRepo()
const movementRepo = new  InventoryMovementRepo()
const reservationRepo = new  InventoryReservationRepo()

const  auditRepo = new  InventoryAuditRepo()

const warehouseResolver = new 
ResolveWarehouseForItemService(inventorieRepo)
// ======================================================
// UseCases
// ======================================================

const getCompanyOwnersUseCase =
  new GetCompanyOwnersUseCase(userRepoInstance);

// TODO:
// Create these with their required dependencies.


/**
     private readonly orderRepo: OrderRepo,

    private readonly inventoryRepo: InventorieRepo,

    private readonly movementRepo: InventoryMovementRepo,

    private readonly reservationRepo: InventoryReservationRepo,

    private readonly auditRepo: InventoryAuditRepo,

    private readonly warehouseResolver:
      ResolveWarehouseForItemService
 */
const reserveStockUseCase = new ReserveStockUseCase(
  // required dependencies
  orderRepoInstance,
  inventorieRepo,
  movementRepo,
  reservationRepo,
  auditRepo,
  warehouseResolver
);

const generateInvoiceUseCase = new GenerateInvoiceUseCase(
  // required dependencies
  invoiceRepo,
  new InvoiceService()
);

// ======================================================
// Create Order By Admin
// ======================================================

const createOrderUseCase = new CreateOrderByAdminUseCase(
  userRepoInstance,
  orderRepoInstance,
  productRepoInstance,
  getCompanyOwnersUseCase,
  reserveStockUseCase,
  generateInvoiceUseCase,
  sequelize
);

// ======================================================
// Controller
// ======================================================

const createOrderByAdminRoute =
  new CreateOrderByAdminController(
    createOrderUseCase
  );

// ======================================================
// Routes
// ======================================================

router.post(
  "/customers/:id/orders",
  verifyToken,
  (req: Request, res: Response) => {
    createOrderByAdminRoute.execute(req, res);
  }
);

export default router;












// router.post(
//   "/customers/:id/orders",
//   verifyToken,
//   (req: Request, res: Response) => {
//     createOrderByAdminRoute.execute(req, res);
//   }
// );

// export default router;
