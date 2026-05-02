

import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";
import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import CreateInventorieUseCase from "../../useCases/InventorieUseCase/CreateInventorieUseCase";
import CreateInventorieController from "../../controllers/Inventorie/CreateInventorieController";
import InventoryMovementRepo from "../../repo/MovementRepo/InventoryMovementRepo";


const router = Router();
/**
    private inventoryRepo: any,
    private variantRepo: any,
    private movementRepo: any

    router.post("/inventories/add-stock", addStockController.handle.bind(addStockController));
router.post("/inventories/reserve", reserveController.handle.bind(reserveController));
router.post("/inventories/confirm-sale", confirmSaleController.handle.bind(confirmSaleController));
router.post("/inventories/release", releaseController.handle.bind(releaseController));
router.post("/inventories/transfer", transferController.handle.bind(transferController));
 */

   const    variantProductRepo   = new VariantProductRepo() 
  const inventoryRepo   = new InventorieRepo()
  const inventoryMovement = new InventoryMovementRepo()

 const createInventorieUseCase  = new CreateInventorieUseCase(inventoryRepo,variantProductRepo,inventoryMovement)
 const CreateInventoryRoute  =  new  CreateInventorieController(createInventorieUseCase)



 router.post("/inventories", verifyToken, (req: Request, res: Response) => {

  CreateInventoryRoute.execute(req, res);
  });
 


export default router;