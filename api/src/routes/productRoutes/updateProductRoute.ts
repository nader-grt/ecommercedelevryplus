import { Request, Response, Router } from "express";
import FileHandler, { folderPath } from "../../filesystem/fileHandle";
import updateProductController from "../../controllers/products/updateProductController";
import CategoryRepo from "../../repo/categoryRepo/categoryRepo";
import SupplierRepo from "../../repo/SupplierRepo/SupplierRepo";
import ProductRepo from "../../repo/productRepo/productRepo";
import UpdateProductUseCase from "../../useCases/productUseCase/UpdateProductUseCase";
import { verifyToken } from "../../middleware/verifyToken";

const router = Router();

const categoryRepo = new CategoryRepo();
const supplierRepo = new SupplierRepo();
const productRepo = new ProductRepo();
export const fileHandler = new FileHandler(folderPath);
const updateProductUseCase = new UpdateProductUseCase(
   fileHandler,
  productRepo,
  categoryRepo,
  supplierRepo
);


const updateProductRoute = new updateProductController(updateProductUseCase);


router.put(
  "/products/:id",
  verifyToken,
  fileHandler.uploadMiddlewareImage("imageName"),
  (req: Request, res: Response) => {
 
    updateProductRoute.execute(req, res);
  }
);

export default router;
