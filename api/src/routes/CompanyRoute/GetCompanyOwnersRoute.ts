import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";

import GetCompanyOwnerUseCase from "../../useCases/companyUseCase/GetCompanyOwnersUseCase";
import GetCompanyOwnerController from "../../controllers/company/GetCompanyOwnersController";
import { userRepo } from "../../repo/auth/userRepo/userRepo";

const router = Router();


const user = new userRepo()

const companyOwnersUseCase   = new GetCompanyOwnerUseCase(user)
const companyOwnerRoute = new GetCompanyOwnerController(companyOwnersUseCase)


router.get("/owners", verifyToken, (req: Request, res: Response) => {
    companyOwnerRoute.execute(req, res);
});

export default router