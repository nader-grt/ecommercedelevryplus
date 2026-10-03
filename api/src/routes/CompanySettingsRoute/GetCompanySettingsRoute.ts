import { Request, Response, Router } from "express";

import { verifyToken } from "../../middleware/verifyToken";
import { requireCompanyUser } from "../../middleware/requireCompanyUser";

import CompanySettingsRepo
  from "../../repo/CompanySettingsRepo/CompanySettingsRepo";

import GetCompanySettingsUseCase
  from "../../useCases/companySettingsUseCase/GetCompanySettingsUseCase";



import GetCompanySettingsController
  from "../../controllers/companySettings/GetCompanySettingsController";



const router = Router();

const companySettingsRepo =
  new CompanySettingsRepo();

const getCompanySettingsUseCase =
  new GetCompanySettingsUseCase(
    companySettingsRepo
  );



const getCompanySettingsController =
  new GetCompanySettingsController(
    getCompanySettingsUseCase
  );


router.get(
  "/company/settings",
  verifyToken,
  requireCompanyUser,
  (req: Request, res: Response) => {
    getCompanySettingsController.execute(req, res);
  }
);



export default router;