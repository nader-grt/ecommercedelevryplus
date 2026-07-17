import { Request, Response, Router } from "express";
import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import InventoryMovementRepo from "../../repo/MovementRepo/InventoryMovementRepo";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";

import { verifyToken } from "../../middleware/verifyToken";
import AdjustStockUseCase from "../../useCases/InventorieUseCase/AdjustStockUseCase";
import AdjustStockController from "../../controllers/Inventorie/AdjustStockController";
import InventoryAuditRepo from "../../repo/InventoryAuditRepo/InventoryAuditRepo";

const router = Router();

/**
 * 
 export default class AdjustStockController extends BaseController {
  private _useCase: AdjustStockUseCase;
 */

const variantProductRepo = new VariantProductRepo();
const inventoryRepo = new InventorieRepo();
const inventoryMovement = new InventoryMovementRepo();
const inventoryAuditRepo = new InventoryAuditRepo()
const adjustStockUsecase = new AdjustStockUseCase(
  inventoryRepo,
  variantProductRepo,
  inventoryMovement,
  inventoryAuditRepo
);
const adjustStockRoute = new AdjustStockController(adjustStockUsecase);

router.post(
  "/inventories/adjust-stock",
  verifyToken,
  (req: Request, res: Response) => {
    adjustStockRoute.execute(req, res);
  }
);

export default router;
