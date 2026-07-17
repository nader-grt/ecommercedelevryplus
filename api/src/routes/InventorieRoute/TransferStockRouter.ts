import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import InventoryMovementRepo from "../../repo/MovementRepo/InventoryMovementRepo";
import WareHouseRepo from "../../repo/WareHouseRepo/WareHouseRepo";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";
import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import TransferStockUseCase from "../../useCases/InventorieUseCase/TransferStockUseCase";
import TransferStockController from "../../controllers/Inventorie/TransferStockController";

const router = Router();

const inventoryRepo = new InventorieRepo();

const variantRepo = new VariantProductRepo();

const warehouseRepo = new WareHouseRepo();

const movementRepo = new InventoryMovementRepo();

const usecaseTransfert = new TransferStockUseCase(
  inventoryRepo,
  variantRepo,
  warehouseRepo,
  movementRepo
);

const transferStockRoute = new TransferStockController(usecaseTransfert);

router.post(
  "/inventories/transfert-stock",
  verifyToken,
  (req: Request, res: Response) => {
    transferStockRoute.execute(req, res);
  }
);

export default router;
