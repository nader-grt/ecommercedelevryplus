import { Request, Response, Router } from "express";
import GetProductController from "../../controllers/products/GetProductController";
import { verifyToken } from "../../middleware/verifyToken";
import ProductRepo from "../../repo/productRepo/productRepo";
import GetProductUseCase from "../../useCases/productUseCase/GetProductUseCase";



const router =Router()  ;



const productrepo = new ProductRepo()
const gettProductUsCase = new GetProductUseCase(productrepo)
const getProductRoute  =  new GetProductController(gettProductUsCase) ;



router.get("/products/:productid",verifyToken,(req:Request,res:Response) => {
       console.log("step num 1 route ")
    getProductRoute.execute(req,res) ;
})



export default router ;

/**
 * 
 * 



GET /categories/:categoryId/products



 */