import { Request, Response } from "express";
import Joi from "joi";

import { BaseController } from "../../infra/BaseCOntroller";
import { RequestAuth } from "../../middleware/verifyToken";
import UpdateCompanySettingsUseCase from "../../useCases/companySettingsUseCase/UpdateCompanySettingsUseCase";

export default class UpdateCompanySettingsController extends BaseController {
  constructor(
    private readonly useCase: UpdateCompanySettingsUseCase
  ) {
    super();
  }

  protected async executeImpl(
    req: RequestAuth,
    res: Response
  ): Promise<any> {
    try {
      const companyId = req.user?.companyId;
      const userId = req.user?.id;

      if (!companyId) {
        return this.badRequest(
          res,
          "User is not associated with a company"
        );
      }

      if (!userId) {
        return this.badRequest(
          res,
          "Authenticated user ID is missing"
        );
      }

      const schema = Joi.object({
        currency: Joi.string()
          .length(3)
          .uppercase()
          .optional(),

        language: Joi.string()
          .max(10)
          .optional(),

        timezone: Joi.string()
          .max(100)
          .optional(),

        taxRate: Joi.number()
          .min(0)
          .max(100)
          .optional(),

        logoCompany: Joi.string()
          .allow(null, "")
          .optional(),

        addressCompany: Joi.string()
          .allow(null, "")
          .optional(),

        phoneCompany: Joi.string()
          .max(20)
          .allow(null, "")
          .optional(),

        emailCompany: Joi.string()
          .email()
          .allow(null, "")
          .optional(),

        isActive: Joi.boolean()
          .optional(),
      }).unknown(false);

      const { error, value } = schema.validate(req.body);

      if (error) {
        return this.badRequest(
          res,
          error.details[0].message
        );
      }

      const result = await this.useCase.execute(
        Number(companyId),
        value,
        Number(userId)
      );

      return this.ok(res, {
        message: "Company settings updated successfully",
        data: result,
      });

    } catch (error: any) {
      console.error(error);

      return this.fail(
        res,
        error.message || "Something went wrong"
      );
    }
  }
}


// import { Request, Response } from "express";



// import UpdateCompanySettingsUseCase
//   from "../../useCases/companySettingsUseCase/UpdateCompanySettingsUseCase";
// import { RequestAuth } from "../../middleware/verifyToken";
// import { BaseController } from "../../infra/BaseCOntroller";

// export default class UpdateCompanySettingsController
//   extends BaseController
// {
//   constructor(
//     private readonly useCase: UpdateCompanySettingsUseCase
//   ) {
//     super();
//   }

//   async executeImpl(
//     req: RequestAuth,
//     res: Response
//   ): Promise<void> {
//     const companyId = req.user?.companyId;
//     const userId = req.user?.id;

//     if (!companyId || !userId) {
//       res.status(403).json({
//         message: "User is not associated with a company",
//       });

//       return;
//     }

//     const settings =
//       await this.useCase.execute(
//         Number(companyId),
//         req.body,
//         Number(userId)
//       );

//     res.status(200).json({
//       message: "Company settings updated successfully",
//       data: settings,
//     });
//   }
// }