import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import ProductRepo from "../../repo/productRepo/productRepo";
import GetProductByCategoryUseCase from "../../useCases/productUseCase/GetProductByCategoryUseCase";
import GetProductByCategoryController from "../../controllers/products/GetProductByCategoryController";
import CategoryRepo from "../../repo/categoryRepo/categoryRepo";



const router = Router() ;



const   productrepo = new ProductRepo() ;
const categoryrepo = new CategoryRepo() ;
const  getProductByCategoryUseCase  = new GetProductByCategoryUseCase(productrepo,categoryrepo) ;
const  getProductByCategoryController =  new GetProductByCategoryController(getProductByCategoryUseCase)

//categories/5/products
router.get("/products/:categoryid/categories",verifyToken,(req:Request,res:Response) => {

    getProductByCategoryController.execute(req,res) ;

})





export default router ;