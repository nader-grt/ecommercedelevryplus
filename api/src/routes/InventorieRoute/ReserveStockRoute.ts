import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import OrderRepo from "../../repo/OrderRepo/OrderRepo";
import InventoryMovementRepo from "../../repo/MovementRepo/InventoryMovementRepo";
import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import ReserveStockUseCase from "../../useCases/InventorieUseCase/ReserveStockUseCase";
import ReserveStockController from "../../controllers/Inventorie/ReserveStockController";
import InventoryReservationRepo from "../../repo/InventoryReservationRepo/InventoryReservationRepo";
import ResolveWarehouseForItemService from "../../services/InventoryService/ResolveWarehouseForItemService";



  const router = Router()
const order = new OrderRepo() ;
const inventory  = new InventorieRepo()
   const inventoryMovement       = new InventoryMovementRepo
   const reservationRepo   = new InventoryReservationRepo()
   const resolveWarehouseForItemService = new ResolveWarehouseForItemService()

    const reserveStockUseCase = new ReserveStockUseCase(order,inventory,inventoryMovement,reservationRepo,resolveWarehouseForItemService)

   const  reserveStockRoute  = new ReserveStockController(reserveStockUseCase)

   router.post(
    "/inventories/reserve-stock",
    verifyToken,
    (req: Request, res: Response) => {
        reserveStockRoute.execute(req, res);
    }
  );




export default router