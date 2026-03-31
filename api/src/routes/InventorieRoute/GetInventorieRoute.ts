

import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";
import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import getInventorieUseCase from "../../useCases/InventorieUseCase/GetInventorieUseCase";
import getInventorieController from "../../controllers/Inventorie/GetInventorieController";


const router = Router();


   const    variantProductRepo   = new VariantProductRepo() 
  const inventorieRepo   = new InventorieRepo()
 const getInventorie  = new getInventorieUseCase(inventorieRepo,variantProductRepo)
 const    getInventorieRoute =  new  getInventorieController(getInventorie)

 router.get("/inventories/:id", verifyToken, (req: Request, res: Response) => {

    getInventorieRoute.execute(req, res);
  });




export default router;