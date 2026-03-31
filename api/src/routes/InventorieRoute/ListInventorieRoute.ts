

import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";
import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import ListInventorieUseCase from "../../useCases/InventorieUseCase/ListInventorieUseCase";
import ListInventorieController from "../../controllers/Inventorie/ListInventorieController";


const router = Router();


   const    variantProductRepo   = new VariantProductRepo() 
  const inventorieRepo   = new InventorieRepo()
 const listInventorieUseCase  = new ListInventorieUseCase(inventorieRepo,variantProductRepo)
 const    listInventorieRoute =  new  ListInventorieController(listInventorieUseCase)

 router.get("/inventories", verifyToken, (req: Request, res: Response) => {

    listInventorieRoute.execute(req, res);
  });




export default router;