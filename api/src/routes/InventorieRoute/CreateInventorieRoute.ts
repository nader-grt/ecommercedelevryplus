

import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";
import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import CreateInventorieUseCase from "../../useCases/InventorieUseCase/CreateInventorieUseCase";
import CreateInventorieController from "../../controllers/Inventorie/CreateInventorieController";


const router = Router();


   const    variantProductRepo   = new VariantProductRepo() 
  const inventorieRepo   = new InventorieRepo()

 const createInventorieUseCase  = new CreateInventorieUseCase(inventorieRepo,variantProductRepo)
 const CreateInventorieRoute  =  new  CreateInventorieController(createInventorieUseCase)



 router.post("/inventories", verifyToken, (req: Request, res: Response) => {

    CreateInventorieRoute.execute(req, res);
  });
 


export default router;