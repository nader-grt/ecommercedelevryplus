import { Transaction } from "sequelize";
import ICompanyRepo from "./ICompanyRepo";
import { Company } from "../../models/main";
import { ICompany, ICompanyCreation } from "../../models/Company";

export default class CompanyRepo implements ICompanyRepo {

  async createCompany(
    data: ICompanyCreation,
    transaction?: Transaction
  ): Promise<ICompany> {
    const company = await Company.create(data, { transaction });
  
    return company.get({ plain: true }); // 
  }

  async findAll(): Promise<ICompany[]> {
    return await Company.findAll({
      attributes: ["id", "name", "type", "isActive"],
      raw: true,
    });
  }

  async findById(id: number): Promise<ICompany | null> {
    const company = await Company.findByPk(id);
  
    if (!company) return null;
  
    return {
      id: company.id,
      name: company.name,
      type: company.type,
      isActive: company.isActive,
    };
  }

  async update(
    id: number,
    data: Partial<ICompany>,
    transaction?: Transaction
  ): Promise<ICompany> {
    const company = await Company.findByPk(id, { transaction });

    if (!company) {
      throw new Error("Company not found");
    }


          console.log(  company ,    "************    ",data)
    return await company.update(data, { transaction });
  }

  async delete(
    id: number,
    transaction?: Transaction
  ): Promise<{ message: string }> {
    const company = await Company.findByPk(id, { transaction });

    if (!company) {
      throw new Error("Company not found");
    }

    await company.destroy({ transaction });

    return { message: "Company deleted successfully" };
  }

  async toggleActive(
    id: number,
    transaction?: Transaction
  ): Promise<ICompany> {
    const company = await Company.findByPk(id, { transaction });

    if (!company) {
      throw new Error("Company not found");
    }

    company.isActive = !company.isActive;

    await company.save({ transaction });

    return company;
  }
}