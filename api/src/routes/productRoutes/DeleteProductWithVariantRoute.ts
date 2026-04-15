import { Request, Response, Router } from "express";

import { verifyToken } from "../../middleware/verifyToken";
import ProductRepo from "../../repo/productRepo/productRepo";
import DeleteProductWithVariantUseCase from "../../useCases/productUseCase/DeleteProductWithVariantUseCase";

import deleteProductVariantController from "../../controllers/products/DeleteProductWithVariantController";

const router = Router();

const productRepo = new ProductRepo();

const deleteProductVariantUseCase = new DeleteProductWithVariantUseCase(
  productRepo
);
const deleteProductVariantRoute = new deleteProductVariantController(
  deleteProductVariantUseCase
);

router.delete("/products/:id", verifyToken, (req: Request, res: Response) => {
  console.log("delete product variants");
  deleteProductVariantRoute.execute(req, res);
});

export default router;
