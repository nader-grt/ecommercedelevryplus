import { Request, Response, Router } from "express";

import FileHandler, { folderPath } from "../../filesystem/fileHandle";
import { verifyToken } from "../../middleware/verifyToken";
import ProductRepo from "../../repo/productRepo/productRepo";
import deleteProductVariantUseCase from "../../useCases/productUseCase/DeleteProductWithVariantUseCase";
import SupplierRepo from "../../repo/SupplierRepo/SupplierRepo";
import CategoryRepo from "../../repo/categoryRepo/categoryRepo";
import deleteProductVariantController from "../../controllers/products/DeleteProductWithVariantController";

const router = Router();

const categoryRepo = new CategoryRepo();
const supplierRepo = new SupplierRepo();
const productRepo = new ProductRepo();
export const fileHandlerCreate = new FileHandler(folderPath);
//fileHandlerCreate
const deleteProductUseCase = new deleteProductVariantUseCase(
//   fileHandlerCreate,
//   productRepo,
//   categoryRepo,
//   supplierRepo
);
//updateProductUseCase
const updateProductVariantRoute = new deleteProductVariantController();

//folderPath

router.delete(
  "/products",
  verifyToken,
  fileHandlerCreate.uploadMiddlewareImage("imageName"),
  (req: Request, res: Response) => {
    console.log("vvvvvvvvvvvvv update productttttt variants    1");
    updateProductVariantRoute.execute(req, res);
  }
);

export default router;
