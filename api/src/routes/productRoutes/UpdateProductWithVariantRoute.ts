import { Request, Response, Router } from "express";

import FileHandler, { folderPath } from "../../filesystem/fileHandle";
import { verifyToken } from "../../middleware/verifyToken";
import ProductRepo from "../../repo/productRepo/productRepo";
import updateProductVariantUseCase from "../../useCases/productUseCase/UpdateProductWithVariantUseCase";
import SupplierRepo from "../../repo/SupplierRepo/SupplierRepo";
import CategoryRepo from "../../repo/categoryRepo/categoryRepo";
import updateProductVariantController from "../../controllers/products/UpdateProductWithVariantController";

const router = Router();

const categoryRepo = new CategoryRepo();
const supplierRepo = new SupplierRepo();
const productRepo = new ProductRepo();
export const fileHandlerUpdate = new FileHandler(folderPath);
//fileHandlerCreate
const updateProductUseCase = new updateProductVariantUseCase(
  fileHandlerUpdate,
  productRepo,
  categoryRepo,
  supplierRepo
);
const updateProductVariantRoute = new updateProductVariantController(updateProductUseCase);

//folderPath

router.put(
  "/products/:id",
  verifyToken,
  fileHandlerUpdate.uploadMiddlewareImage("imageName"),

  (req: Request, res: Response) => {
    console.log("vvvvvvvvvvvvv bbbbbbbbbbbbbbbbbbupdate productttttt variants    1");
    updateProductVariantRoute.execute(req, res);
  }
);

export default router;



