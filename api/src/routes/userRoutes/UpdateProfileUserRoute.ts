import { Request, Response, Router } from "express";

import { verifyToken } from "../../middleware/verifyToken";
import { UserControllerFactory } from "../../FactoryUsers/FactroryUser";


const router = Router();



router.put("/users/me", verifyToken, (req: Request, res: Response) => {
    UserControllerFactory.UpdateProfileUserrController().execute(req, res);
});

export default router;
