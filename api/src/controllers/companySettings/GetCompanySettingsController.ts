import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import GetCompanySettingsUseCase from "../../useCases/companySettingsUseCase/GetCompanySettingsUseCase";
import { RequestAuth } from "../../middleware/verifyToken";

export default class GetCompanySettingsController extends BaseController {
  constructor(private readonly useCase: GetCompanySettingsUseCase) {
    super();
  }

  async executeImpl(req: RequestAuth, res: Response): Promise<any> {
    const companyId = req.user?.companyId;
    console.log("apigateway docker is \t \t", companyId);
    if (!companyId) {
      res.status(403).json({
        message: "User is not associated with a company",
      });

      return;
    }

    const settings = await this.useCase.execute(Number(companyId));

    // res.status(200).json({
    //   message: "Company settings fetched successfully",
    //   data: settings,
    // });
    if (!settings) {
      res.status(200).json({
        message: "Company settings are not configured yet",
        data: null,
      });
      return this.resultValue(res, {
        message: "Company settings are not configured yet",
        data: null,
      });
    }

    return this.resultValue(res, {
      message: "Company settings fetched successfully",
      data: settings,
    });
  }
}
