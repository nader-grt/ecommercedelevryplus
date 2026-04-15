import { Request, Response, Router } from "express";
import GetProductVariantController from "../../controllers/products/GetProductWithVariantController";
import { verifyToken } from "../../middleware/verifyToken";
import ProductRepo from "../../repo/productRepo/productRepo";
import GetProductVariantUseCase from "../../useCases/productUseCase/GetProductWithVariantUseCase";



const router =Router()  ;



const productrepo = new ProductRepo()
const gettProductVariantUsCase = new GetProductVariantUseCase(productrepo)
const getProductVariantRoute  =  new GetProductVariantController(gettProductVariantUsCase) ;







router.get("/products/:productid",verifyToken,(req:Request,res:Response) => {
   
    getProductVariantRoute.execute(req,res) ;
})





export default router;