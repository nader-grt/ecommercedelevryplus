import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";
import ConvertProductToVariableUseCase from "../../useCases/VariantProductUseCase/ConvertProductToVariableUseCase";
import ConvertProductToVariableController from "../../controllers/VariantProduct/ConvertProductToVariableController";


const router = Router();





//PATCH /api/products/:id/convert-to-variable





  const variantRepo  = new  VariantProductRepo();

  const convertUsecase = new  ConvertProductToVariableUseCase(variantRepo)
   const convertToVariableRoute  = new ConvertProductToVariableController(convertUsecase)
 




   router.patch("/products/:id/convert-to-variable", verifyToken, (req:Request, res:Response) => {
    console.log("ccccccccccccccccccccccc  convert ")
    convertToVariableRoute.execute(req, res);
});



   export default router