import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";
import ListVariantProductUseCase from "../../useCases/VariantProductUseCase/ListVariantProductUseCase";
import ListVariantProductController from "../../controllers/VariantProduct/ListVariantProductController";

const router = Router();

const variantProductRepo = new VariantProductRepo();
const listVariantProductUseCase = new ListVariantProductUseCase(
  variantProductRepo
);
const listVariantsProducRoute = new ListVariantProductController(
    listVariantProductUseCase
);

router.get("/variants", verifyToken, (req:Request, res:Response) => {
    listVariantsProducRoute.execute(req, res);
});

export default router;
