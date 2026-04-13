import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";
import deleteVariantsUseCase from "../../useCases/VariantProductUseCase/DeleteVariantForProductUseCase";
import deleteVariantsController from "../../controllers/VariantProduct/DeleteVariantForProductController";

const router = Router();

const variantRepo = new VariantProductRepo();

const deleteUsecase = new deleteVariantsUseCase(variantRepo);
const deleteVariantRoute = new deleteVariantsController(deleteUsecase);

router.delete("/variants/:id", verifyToken, (req: Request, res: Response) => {
  console.log("delete  variants   ");
  deleteVariantRoute.execute(req, res);
});

export default router;
