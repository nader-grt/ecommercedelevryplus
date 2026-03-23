import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import CompanyRepo from "../../repo/CompanyRepo/CompanyRepo";
import ListCompanyUseCase from "../../useCases/companyUseCase/ListCompanyUseCase";
import ListCompanyController from "../../controllers/company/ListCompanyController";

const router = Router();

const company = new CompanyRepo();
const listCompanyUseCase = new ListCompanyUseCase(company);
const listCompanyRoute = new ListCompanyController(listCompanyUseCase);

router.get("/companies", verifyToken, (req: Request, res: Response) => {
  listCompanyRoute.execute(req, res);
});

export default router;
