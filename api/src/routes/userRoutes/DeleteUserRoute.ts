import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import { UserControllerFactory } from "../../FactoryUsers/FactroryUser";

const router = Router();


router.delete( "/users/:id", verifyToken, (req: Request, res: Response) => 
  {
    UserControllerFactory.DeleteUserByAdminController().execute(req, res);
  }
);

export default router;
