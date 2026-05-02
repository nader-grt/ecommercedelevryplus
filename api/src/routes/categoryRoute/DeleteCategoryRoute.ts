import { Request, Response, Router } from "express";

import DeleteCategoryController from "../../controllers/category/DeleteCategoryController";
import { verifyToken } from "../../middleware/verifyToken";
import DeleteCategoryUseCase from "../../useCases/categoryUseCase/DeleteCategoryUseCase";
import ProductRepo from "../../repo/productRepo/productRepo";
import CategoryRepo from "../../repo/categoryRepo/categoryRepo";

const router = Router();

const productrepo = new ProductRepo()

const categoryRepo = new CategoryRepo() ;
const deletetusecaseCategory = new DeleteCategoryUseCase(categoryRepo,productrepo)
const deleteCategoryRoute  =  new DeleteCategoryController(deletetusecaseCategory)






router.delete("/categories/:id", verifyToken ,(req:Request,res:Response) => {
        console.log("req delete categoryy hhhhhhhhhhhhhhhhheyyyyyy " )
        deleteCategoryRoute.execute(req,res)
})



export default router