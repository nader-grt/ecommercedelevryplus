import { Request, Response } from "express";
import { RequestAuth } from "../../middleware/verifyToken";
import { BaseController } from "../../infra/BaseCOntroller";
import GetMyCompanyUseCase from "../../useCases/companyUseCase/GetMyCompanyUseCase";

export default class GetMyCompanyController  extends BaseController {
  constructor(private readonly useCase: GetMyCompanyUseCase) {
    super()
  }

  async executeImpl(req: RequestAuth, res: Response) {
    try {
      const companyId = req.user?.companyId;

      if (!companyId) {
        return res.status(403).json({
          message: "User is not associated with a company",
        });
      }

      const company = await this.useCase.execute(companyId);

    //   return res.status(200).json({
    //     message: "Company fetched successfully",
    //     data: company,
    //   });

      return this.resultValue(res,{
        message: "Company fetched successfully",
        data: company,
      })
    } catch (error: any) {
    //   return res.status(404).json({
    //     message: error.message || "Company not found",
    //   });

      return this.notFound(res, error.message || "Company not found")
    }
  }
}