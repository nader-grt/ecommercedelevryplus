import { Op, Transaction } from "sequelize";
import { InventoryReservation } from "../../models/InventoryReservation";

export interface CreateReservationDTO {
  inventoryId: number;
  orderId: number;
  variantId: number;
  warehouseId: number;
  companyId: number;
  quantity: number;
  status: "PENDING" | "RELEASED" | "CONSUMED";
  userId?: number;
  note?: string;
}

export interface ReservationWhere {
  id?: number;
  orderId?: number;
  orderItemId?: number;      // إذا أضفت العمود لاحقاً
  inventoryId?: number;
  variantId?: number;
  warehouseId?: number;
  companyId?: number;
    // معدل: يقبل string أو كائن Sequelize
    status?: string | { [Op.ne]: string } | { [Op.in]: string[] } | { [Op.notIn]: string[] };
    
       
  statusNot?: string;        // للاستبعاد
  createdAtFrom?: Date;      // فلترة بالتاريخ
  createdAtTo?: Date;
}

export interface FindAllOptions {
  where: ReservationWhere;
  transaction?: Transaction;
  limit?: number;
  offset?: number;
  order?: [string, string][]; // [['createdAt', 'DESC']]
  include?: any[];            // للعلاقات
}

export default interface IInventoryReservationRepo {

  // =========================
  // CREATE
  // =========================

  findAll(options: FindAllOptions): Promise<InventoryReservation[]>
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