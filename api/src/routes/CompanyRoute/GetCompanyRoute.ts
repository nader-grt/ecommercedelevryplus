import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import CompanyRepo from "../../repo/CompanyRepo/CompanyRepo";
import getCompanyUseCase from "../../useCases/companyUseCase/GetCompanyUseCase";
import getCompanyController from "../../controllers/company/GetCompanyController";

const router = Router();

const company = new CompanyRepo();



const useCase = new getCompanyUseCase(company);
const getCompanyRoute = new getCompanyController(useCase);

router.get("/companies/:id", verifyToken, (req: Request, res: Response) => {
    getCompanyRoute.execute(req, res);
});



export default router