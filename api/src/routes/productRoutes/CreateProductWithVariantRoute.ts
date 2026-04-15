import { Request, Response, Router } from "express";

import FileHandler, { folderPath } from "../../filesystem/fileHandle";
import { verifyToken } from "../../middleware/verifyToken";
import ProductRepo from "../../repo/productRepo/productRepo";
import CreateProductVariantUseCase from "../../useCases/productUseCase/CreateProductWithVariantUseCase";
import SupplierRepo from "../../repo/SupplierRepo/SupplierRepo";
import CategoryRepo from "../../repo/categoryRepo/categoryRepo";
import createProductVariantController from "../../controllers/products/CreateProductWithVariantController";

const router = Router();

const categoryRepo = new CategoryRepo();
const supplierRepo = new SupplierRepo();
const productRepo = new ProductRepo();
export const fileHandlerCreate = new FileHandler(folderPath);
//fileHandlerCreate
const createProductUseCase = new CreateProductVariantUseCase(
  fileHandlerCreate,
  productRepo,
  categoryRepo,
  supplierRepo
);
const createProductVariantRoute = new createProductVariantController(createProductUseCase);

//folderPath

router.post(
  "/products",
  verifyToken,
  fileHandlerCreate.uploadMiddlewareImage("imageName"),
  (req: Request, res: Response) => {
    console.log(" create productttttt variants    1");
    createProductVariantRoute.execute(req, res);
  }
);

export default router;
