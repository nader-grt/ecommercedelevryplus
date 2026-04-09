

import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";
import ProductRepo from "../../repo/productRepo/productRepo";
import CreateVariantForProductUseCase from "../../useCases/VariantProductUseCase/CreateVariantForProductUseCase";
import CreateVariantForProductController from "../../controllers/VariantProduct/CreateVariantForProductController";


const router = Router() ;



/**
 * 
 * POST /products/1/variants


  
 
 
 */
  const variantProductRepo  = new  VariantProductRepo()
  const  productRepo  =  new  ProductRepo();

 const createVariantProductUseCase = new   CreateVariantForProductUseCase(productRepo ,variantProductRepo)

 const  createVariantProductRoute  = new  CreateVariantForProductController(createVariantProductUseCase)


 router.post("/products/:id/variants", verifyToken, (req:Request, res:Response) => {
    createVariantProductRoute.execute(req, res);
});



export default router