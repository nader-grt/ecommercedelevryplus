import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import CompanyRepo from "../../repo/CompanyRepo/CompanyRepo";
import CreateCompanyUseCase from "../../useCases/companyUseCase/CreateCompanyUseCase";
import CreateCompanyController from "../../controllers/company/CreateCompanyController";
import { userRepo } from "../../repo/auth/userRepo/userRepo";

const router = Router();

const company = new CompanyRepo();
const user = new userRepo();

const createCompanyuseCase = new CreateCompanyUseCase(company, user);
const CreateCompanyRoute = new CreateCompanyController(createCompanyuseCase);
router.post("/companies", verifyToken, (req: Request, res: Response) => {
  console.log("req", req.body);
  CreateCompanyRoute.execute(req, res);
});

export default router;
