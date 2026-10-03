import { Request, Response, Router } from "express";

import { verifyToken } from "../../middleware/verifyToken";
import { requireCompanyUser } from "../../middleware/requireCompanyUser";

import CompanySettingsRepo
  from "../../repo/CompanySettingsRepo/CompanySettingsRepo";



import UpdateCompanySettingsUseCase
  from "../../useCases/companySettingsUseCase/UpdateCompanySettingsUseCase";



import UpdateCompanySettingsController
  from "../../controllers/companySettings/UpdateCompanySettingsController";

const router = Router();

const companySettingsRepo =
  new CompanySettingsRepo();



const updateCompanySettingsUseCase =
  new UpdateCompanySettingsUseCase(
    companySettingsRepo
  );

const updateCompanySettingsController =
  new UpdateCompanySettingsController(
    updateCompanySettingsUseCase
  );



router.put(
  "/company/settings",
  verifyToken,
  requireCompanyUser,
  (req: Request, res: Response) => {
    updateCompanySettingsController.execute(req, res);
  }
);

export default router;