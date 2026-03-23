import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import CompanyRepo from "../../repo/CompanyRepo/CompanyRepo";
import deleteCompanyUseCase from "../../useCases/companyUseCase/DeleteCompanyUseCase";
import deleteCompanyController from "../../controllers/company/DeleteCompanyController";

const router = Router();

const company = new CompanyRepo();

const useCase = new deleteCompanyUseCase(company);
const deleteCompanyRoute = new deleteCompanyController(useCase);

router.delete("/companies/:id", verifyToken, (req: Request, res: Response) => {
  deleteCompanyRoute.execute(req, res);
});

export default router;
