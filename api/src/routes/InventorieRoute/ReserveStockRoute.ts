import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import OrderRepo from "../../repo/OrderRepo/OrderRepo";
import InventoryMovementRepo from "../../repo/MovementRepo/InventoryMovementRepo";
import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import ReserveStockUseCase from "../../useCases/InventorieUseCase/ReserveStockUseCase";
import ReserveStockController from "../../controllers/Inventorie/ReserveStockController";
import InventoryReservationRepo from "../../repo/InventoryReservationRepo/InventoryReservationRepo";
import ResolveWarehouseForItemService from "../../services/InventoryService/ResolveWarehouseForItemService";
import InventoryAuditRepo from "../../repo/InventoryAuditRepo/InventoryAuditRepo";

const router = Router();
const order = new OrderRepo();
const inventory = new InventorieRepo();
/**
    private readonly orderRepo: OrderRepo,
        private readonly inventoryRepo: InventorieRepo,
        private readonly movementRepo: InventoryMovementRepo,
        private readonly reservationRepo: InventoryReservationRepo,
        private readonly auditRepo: InventoryAuditRepo,
        private readonly warehouseResolver: ResolveWarehouseForItemService
 */
const inventoryMovement = new InventoryMovementRepo();
const reservationRepo = new InventoryReservationRepo();
const auditRepo = new InventoryAuditRepo();
const resolveWarehouseForItemService = new ResolveWarehouseForItemService(inventory);

const reserveStockUseCase = new ReserveStockUseCase(
  order,
  inventory,
  inventoryMovement,
  reservationRepo,
  auditRepo,
  resolveWarehouseForItemService
);

const reserveStockRoute = new ReserveStockController(reserveStockUseCase);

router.post(
  "/inventories/reserve-stock",
  verifyToken,
  (req: Request, res: Response) => {
    reserveStockRoute.execute(req, res);
  }
);

export default router;
