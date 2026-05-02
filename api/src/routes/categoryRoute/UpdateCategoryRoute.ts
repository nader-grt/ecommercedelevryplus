import { Request, Response, Router } from "express";

import UpdateCategoryController from "../../controllers/category/UpdateCategoryController";
import { verifyToken } from "../../middleware/verifyToken";
import CategoryRepo from "../../repo/categoryRepo/categoryRepo";
import UpdateCategoryUseCase from "../../useCases/categoryUseCase/UpdateCategoryUseCase";
import ProductRepo from "../../repo/productRepo/productRepo";


const router = Router();



const categoryRepo = new CategoryRepo() ;

const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepo)
const updateCategoryRoute  =  new UpdateCategoryController(updateCategoryUseCase)




router.put("/categories/:id",verifyToken, (req:Request,res:Response) => {
        console.log("req *******  updddddddddddddd " , req.body)
        updateCategoryRoute.execute(req,res)
})



export default router