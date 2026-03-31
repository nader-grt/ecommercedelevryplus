import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";
import GetVariantProductUseCase from "../../useCases/VariantProductUseCase/GetVariantProductUseCase";
import GetVariantsProducController from "../../controllers/VariantProduct/GetVariantsProducController";

const router = Router();

const variantProductRepo = new VariantProductRepo();
const getVariantProductUseCase = new GetVariantProductUseCase(
  variantProductRepo
);
const getVariantsProducRoute = new GetVariantsProducController(
  getVariantProductUseCase
);

router.get("/variants/:id", verifyToken, (req:Request, res:Response) => {
  getVariantsProducRoute.execute(req, res);
});

export default router;
