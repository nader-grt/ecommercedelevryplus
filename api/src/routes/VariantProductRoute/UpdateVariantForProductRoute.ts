import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";
import updateVariantsUseCase from "../../useCases/VariantProductUseCase/UpdateVariantForProductUseCase";
import updateVariantsController from "../../controllers/VariantProduct/UpdateVariantForProductController";

const router = Router();

const variantRepo = new VariantProductRepo();

const updateUsecase = new updateVariantsUseCase(variantRepo);
const updateVariantRoute = new updateVariantsController(updateUsecase);

router.put("/variants/:id", verifyToken, (req: Request, res: Response) => {
  console.log("update variants  convert ");
  updateVariantRoute.execute(req, res);
});

export default router;
