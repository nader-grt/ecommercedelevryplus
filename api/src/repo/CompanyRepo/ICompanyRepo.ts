import { Transaction } from "sequelize";
import { ICompany, ICompanyCreation } from "../../models/Company";

export default interface ICompanyRepo {
  findOwnersWithCompanyAndAddress(): Promise<any[]>;

  createUserCompanyFullFlow(data: any): Promise<any>;
  // =========================
  // CREATE
  // =========================
  createCompany(
    data: ICompanyCreation,
    transaction?: Transaction
  ): Promise<ICompany>;

  // =========================
  // READ (basic)
  // =========================
  findAll(filterIds?: number[]): Promise<ICompany[]>;

  findById(id: number): Promise<ICompany | null>;

  // =========================
  // PRO FEATURES
  // =========================

  findAllPaginated?(page: number, limit: number): Promise<any>;

  findByOwnerId?(ownerId: number): Promise<ICompany[]>;

  findByNameAndOwner?(
    name: string,
    ownerId: number
  ): Promise<ICompany | null>;

  // =========================
  // UPDATE
  // =========================
  update(
    id: number,
    data: Partial<ICompany>,
    transaction?: Transaction
  ): Promise<ICompany>;

  // =========================
  // DELETE
  // =========================
  delete(
    id: number,
    transaction?: Transaction
  ): Promise<{ message: string }>;

  softDelete?(
    id: number,
    transaction?: Transaction
  ): Promise<{ message: string }>;

  // =========================
  // STATUS
  // =========================
  toggleActive(
    id: number,
    transaction?: Transaction
  ): Promise<ICompany>;
}