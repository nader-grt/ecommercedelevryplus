import { Request, Response, Router } from "express";

import { verifyToken } from "../../middleware/verifyToken";
import { requireCompanyUser } from "../../middleware/requireCompanyUser";

import CompanyRepo from "../../repo/CompanyRepo/CompanyRepo";

import GetMyCompanyUseCase from "../../useCases/companyUseCase/GetMyCompanyUseCase";
import GetMyCompanyController from "../../controllers/company/GetMyCompanyController";

const router = Router();

const company = new CompanyRepo();

const useCase = new GetMyCompanyUseCase(company);

const getMyCompanyController = new GetMyCompanyController(useCase);

router.get(
  "/company/me",
  verifyToken,
  requireCompanyUser,
  (req: Request, res: Response) => {
    getMyCompanyController.execute(req, res);
  }
);

export default router;