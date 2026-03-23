import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import CompanyRepo from "../../repo/CompanyRepo/CompanyRepo";
import updateCompanyUseCase from "../../useCases/companyUseCase/UpdateCompanyUseCase";
import updateCompanyController from "../../controllers/company/UpdateCompanyController";

const router = Router();

const company = new CompanyRepo();



const useCase = new updateCompanyUseCase(company);
const putCompanyRoute = new updateCompanyController(useCase);

router.put("/companies/:id", verifyToken, (req: Request, res: Response) => {
    putCompanyRoute.execute(req, res);
});



export default router