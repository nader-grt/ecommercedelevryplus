import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";
import DeleteVariantForProductUseCase from "../../useCases/VariantProductUseCase/DeleteVariantForProductUseCase";
import DeleteVariantForProductController from "../../controllers/VariantProduct/DeleteVariantForProductController";

const router = Router();

const variantRepo = new VariantProductRepo();

const deleteVariantUsecase = new DeleteVariantForProductUseCase(variantRepo);
const deleteVariantRoute = new DeleteVariantForProductController(deleteVariantUsecase);

router.delete("/variants/:id", verifyToken, (req: Request, res: Response) => {
  console.log("delete  variants   ");
  deleteVariantRoute.execute(req, res);
});

export default router;
