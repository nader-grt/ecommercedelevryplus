import { Transaction } from "sequelize";

export interface CreateReservationDTO {
  inventoryId: number;
  orderId: number;
  variantId: number;
  warehouseId: number;
  companyId: number;
  quantity: number;
  status: "ACTIVE" | "RELEASED" | "CONSUMED";
  userId?: number;
  note?: string;
}

export default interface IInventoryReservationRepo {

  // =========================
  // CREATE
  // =========================

  create(
    data: CreateReservationDTO,
    transaction?: Transaction
  ): Promise<any>;

  bulkCreate(
    data: CreateReservationDTO[],
    transaction?: Transaction
  ): Promise<any>;

  // =========================
  // FIND
  // =========================

  findById(
    id: number,
    transaction?: Transaction
  ): Promise<any | null>;

  findByOrder(
    orderId: number,
    transaction?: Transaction
  ): Promise<any[]>;

  findActiveByOrder(
    orderId: number,
    transaction?: Transaction
  ): Promise<any[]>;

  findByInventory(
    inventoryId: number,
    transaction?: Transaction
  ): Promise<any[]>;

  findByVariant(
    variantId: number,
    transaction?: Transaction
  ): Promise<any[]>;

  // =========================
  // UPDATE
  // =========================

  update(
    id: number,
    data: Partial<CreateReservationDTO>,
    transaction?: Transaction
  ): Promise<any>;

  // =========================
  // STATUS
  // =========================

  release(
    id: number,
    transaction?: Transaction
  ): Promise<void>;

  consume(
    id: number,
    transaction?: Transaction
  ): Promise<void>;

  cancel(
    id: number,
    transaction?: Transaction
  ): Promise<void>;

  // =========================
  // DELETE
  // =========================

  delete(
    id: number,
    transaction?: Transaction
  ): Promise<void>;


  /**
   findByCompany(
  companyId: number,
  transaction?: Transaction
): Promise<any[]>;

findActiveByCompany(
  companyId: number,
  transaction?: Transaction
): Promise<any[]>;

findByOrderAndCompany(
  orderId: number,
  companyId: number,
  transaction?: Transaction
): Promise<any[]>;
   */
}