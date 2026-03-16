import { Request, Response, Router } from "express";
import ProductRepo from "../../repo/productRepo/productRepo";
import GetAllProductsFiltredByCategoryIdUseCase from "../../useCases/productUseCase/GetAllProductsFiltredByCategoryIdUseCase";
import GetAllProductsFiltredByCategoryIdController from "../../controllers/products/GetAllProductsFiltredByCategoryIdController";
import { verifyToken } from "../../middleware/verifyToken";





const router = Router()

const productRepo  = new ProductRepo()

const getAllProductsFiltredByCategoryIdUseCase =  new  GetAllProductsFiltredByCategoryIdUseCase(productRepo)

 const getAllProductsFiltredByCategoryIdRoute = new   GetAllProductsFiltredByCategoryIdController(getAllProductsFiltredByCategoryIdUseCase) ;

 router.get("/products",verifyToken, (req:Request,res:Response) => {

   console.log(" hereeeeeeeeeeee  111 ")
    getAllProductsFiltredByCategoryIdRoute.execute(req,res)
 })



export default router 