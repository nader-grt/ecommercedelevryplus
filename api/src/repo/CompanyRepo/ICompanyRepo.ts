import { Transaction } from "sequelize";
import { ICompany, ICompanyCreation } from "../../models/Company";

export default interface ICompanyRepo {
  createCompany(
    data: ICompanyCreation,
    transaction?: Transaction
  ): Promise<ICompany>;

  findAll(): Promise<ICompany[]>;

  findById(id: number): Promise<ICompany | null>;

  update(
    id: number,
    data: Partial<ICompany>,
    transaction?: Transaction
  ): Promise<ICompany>;

  delete(
    id: number,
    transaction?: Transaction
  ): Promise<{ message: string }>;

  toggleActive(
    id: number,
    transaction?: Transaction
  ): Promise<ICompany>;
}