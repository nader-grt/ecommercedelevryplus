import { Request, Response, Router } from "express";
import createCategoryController from "../../controllers/category/createCategoryController.";
import { verifyToken } from "../../middleware/verifyToken";
import CategoryRepo from "../../repo/categoryRepo/categoryRepo";
import CreateCategoryUseCase from "../../useCases/categoryUseCase/createCategoryUseCase";

const router = Router();

const categoryRepo = new CategoryRepo();
const createCategoryUseCase = new CreateCategoryUseCase(categoryRepo);
const createCategoryRoute = new createCategoryController(createCategoryUseCase);


router.post("/categories", verifyToken, (req: Request, res: Response) => {
  console.log("req", req.body);
  createCategoryRoute.execute(req, res);
});

export default router;
