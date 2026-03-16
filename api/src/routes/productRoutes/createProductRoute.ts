import { Request, Response, Router } from "express";

import FileHandler, { folderPath } from "../../filesystem/fileHandle";
import { verifyToken } from "../../middleware/verifyToken";
import ProductRepo from "../../repo/productRepo/productRepo";
import CreateProductUseCase from "../../useCases/productUseCase/createProductUseCase";
import SupplierRepo from "../../repo/SupplierRepo/SupplierRepo";
import CategoryRepo from "../../repo/categoryRepo/categoryRepo";
import createProductController from "../../controllers/products/CreateProductController";

const router = Router();

const categoryRepo = new CategoryRepo();
const supplierRepo = new SupplierRepo();
const productRepo = new ProductRepo();
export const fileHandlerCreate = new FileHandler(folderPath);
//fileHandlerCreate
const createProductUseCase = new CreateProductUseCase(
  fileHandlerCreate,
  productRepo,
  categoryRepo,
  supplierRepo
);
const createProductRoute = new createProductController(createProductUseCase);

//folderPath

router.post(
  "/products",
  verifyToken,
  fileHandlerCreate.uploadMiddlewareImage("imageName"),
  (req: Request, res: Response) => {
    console.log(" create productttttt   route  1");
    createProductRoute.execute(req, res);
  }
);

export default router;
