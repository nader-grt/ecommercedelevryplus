import { Request, Response, Router } from "express";
import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import InventoryMovementRepo from "../../repo/MovementRepo/InventoryMovementRepo";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";
import AddStockInventorieController from "../../controllers/Inventorie/AddStockInventorieController";
import AddStockInventorieUseCase from "../../useCases/InventorieUseCase/AddStockInventorieUseCase";
import { verifyToken } from "../../middleware/verifyToken";
import WareHouseRepo from "../../repo/WareHouseRepo/WareHouseRepo";

const router = Router();

const variantProductRepo = new VariantProductRepo();
const inventoryRepo = new InventorieRepo();
const inventoryMovement = new InventoryMovementRepo();
const warehouse = new WareHouseRepo()
const addStockUsecase = new AddStockInventorieUseCase(
  inventoryRepo,
  variantProductRepo,
  inventoryMovement,
  warehouse
);
const addStockRoute = new AddStockInventorieController(addStockUsecase);

router.post(
  "/inventories/add-stock",
  verifyToken,
  (req: Request, res: Response) => {
    addStockRoute.execute(req, res);
  }
);

export default router;
