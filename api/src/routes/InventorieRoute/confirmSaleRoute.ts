import { Request, Response, Router } from "express";

import { verifyToken } from "../../middleware/verifyToken";
import { ConfirmSaleUseCase } from "../../useCases/InventorieUseCase/ConfirmSaleUseCase";
import ConfirmSaleController from "../../controllers/Inventorie/ConfirmSaleController";
import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import InventoryMovementRepo from "../../repo/MovementRepo/InventoryMovementRepo";


const router = Router();


/**
  private _InventorieRepo: InventorieRepo,
    private  _InventoryMovementRepo: InventoryMovementRepo
 */
const inventoryRepo = new InventorieRepo();
const movementRepo = new InventoryMovementRepo();
const useCase = new ConfirmSaleUseCase(inventoryRepo, movementRepo);
const confirmSaleRoute = new ConfirmSaleController(useCase);

router.post("/inventories/confirm-sale", verifyToken, (req:Request, res:Response) => confirmSaleRoute.execute(req, res));

export default router;