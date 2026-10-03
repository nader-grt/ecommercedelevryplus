import { Transaction } from "sequelize";

import ICompanySettingsRepo, {
  ICompanySettings,
  ICompanySettingsCreation,
  ICompanySettingsUpdate,
} from "./ICompanySettingsRepo";
import { CompanySettingsModelInstance } from "../../models/main";

export default class CompanySettingsRepo implements ICompanySettingsRepo {
  //   async findByCompanyId(
  //     companyId: number
  //   ): Promise<ICompanySettings | null> {
  //     const settings = await CompanySettingsModelInstance.findOne({
  //       where: {
  //         companyId,
  //       },
  //     });

  //     if (!settings) {
  //       return null;
  //     }

  //     return settings.get({ plain: true }) as ICompanySettings;
  //   }

  async findByCompanyId(companyId: number): Promise<ICompanySettings | null> {
    try {
      console.log("CompanySettingsRepo.findByCompanyId =>", companyId);

      const settings = await CompanySettingsModelInstance.findOne({
        where: {
          companyId,
        },
      });

      console.log(
        "CompanySettingsRepo result =>",
        settings?.get({ plain: true })
      );

      if (!settings) {
        return null;
      }

      return settings.get({ plain: true }) as ICompanySettings;
    } catch (error) {
      console.error(" CompanySettingsRepo.findByCompanyId ERROR:", error);

      throw error;
    }
  }
  async create(
    data: ICompanySettingsCreation | any,
    transaction?: Transaction
  ): Promise<ICompanySettings> {
    const settings = await CompanySettingsModelInstance.create(data, {
      transaction,
    });

    return settings.get({
      plain: true,
    }) as ICompanySettings;
  }

  async update(
    companyId: number,
    data: ICompanySettingsUpdate,
    transaction?: Transaction
  ): Promise<ICompanySettings> {
    const settings = await CompanySettingsModelInstance.findOne({
      where: {
        companyId,
      },
      transaction,
    });

    if (!settings) {
      throw new Error("Company settings not found");
    }

    const updated = await settings.update(data, {
      transaction,
    });

    return updated.get({
      plain: true,
    }) as ICompanySettings;
  }
}
