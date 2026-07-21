import { Transaction, Op, WhereOptions } from "sequelize";

import { InventoryReservation } from "../../models/main";

import IInventoryReservationRepo, {
  CreateReservationDTO,
  FindAllOptions,
  ReservationWhere,
} from "./IInventoryReservationRepo";
//import { InventoryReservation } from "../../models/InventoryReservation";

export default class InventoryReservationRepo
  implements IInventoryReservationRepo
{
  // =========================
  // CREATE
  // =========================

  async create(
    data: any,
    transaction?: Transaction
  ): Promise<any> {
    return InventoryReservation.create(data, { transaction });
  }

  async bulkCreate(
    data: any,
    transaction?: Transaction
  ): Promise<any> {
    return InventoryReservation.bulkCreate(data, {
      transaction,
    });
  }

  // =========================
  // FIND
  // =========================

  async findById(
    id: number,
    transaction?: Transaction
  ): Promise<any | null> {
    return InventoryReservation.findByPk(id, {
      transaction,
    });
  }


    /**
     * ✅ البحث عن جميع الحجوزات (التي طلبتها)
     */
    async findAll(options: FindAllOptions): Promise<any[]> {
        
      const { where, transaction, limit, offset, order, include } = options;
      
      // بناء شرط WHERE
      const sequelizeWhere = this.buildWhere(where);
      
      // بناء خيارات البحث
      const findOptions: any = {
          where: sequelizeWhere,
          transaction
      };

      // إضافة الخيارات الاختيارية
      if (limit !== undefined) {
          findOptions.limit = limit;
      }

      if (offset !== undefined) {
          findOptions.offset = offset;
      }

      if (order) {
          findOptions.order = order;
      }

      if (include) {
          findOptions.include = include;
      }

      return await InventoryReservation.findAll(findOptions);
  }


  async findByOrder(
    orderId: number,
    transaction?: Transaction
  ): Promise<any[]> {
    return InventoryReservation.findAll({
      where: {
        orderId,
      },
      transaction,
    });
  }

  async findActiveByOrder(
    orderId: number,
    transaction?: Transaction
  ): Promise<any[]> {
    return InventoryReservation.findAll({
      where: {
        orderId,
        status: "ACTIVE",
      },
      transaction,
    });
  }

  async findByInventory(
    inventoryId: number,
    transaction?: Transaction
  ): Promise<any[]> {
    return InventoryReservation.findAll({
      where: {
        inventoryId,
      },
      transaction,
    });
  }

  async findByVariant(
    variantId: number,
    transaction?: Transaction
  ): Promise<any[]> {
    return InventoryReservation.findAll({
      where: {
        variantId,
      },
      transaction,
    });
  }

  // =========================
  // UPDATE
  // =========================

  async update(
    id: number,
    data: Partial<any>,
    transaction?: Transaction
  ): Promise<any> {
    const reservation = await InventoryReservation.findByPk(id, {
      transaction,
      lock: transaction?.LOCK.UPDATE,
    });

    if (!reservation) {
      throw new Error("Inventory reservation not found");
    }

    return reservation.update(data, {
      transaction,
    });
  }

  // =========================
  // STATUS
  // =========================

  async release(
    id: number,
    transaction?: Transaction
  ): Promise<void> {
    await this.update(
      id,
      {
        status: "RELEASED",
      },
      transaction
    );
  }

  async consume(
    id: number,
    transaction?: Transaction
  ): Promise<void> {
    await this.update(
      id,
      {
        status: "CONSUMED",
      },
      transaction
    );
  }

  async cancel(
    id: number,
    transaction?: Transaction
  ): Promise<void> {
    await this.update(
      id,
      {
        status: "RELEASED",
      },
      transaction
    );
  }

  // =========================
  // DELETE
  // =========================

  async delete(
    id: number,
    transaction?: Transaction
  ): Promise<void> {
    const reservation = await InventoryReservation.findByPk(id, {
      transaction,
      lock: transaction?.LOCK.UPDATE,
    });

    if (!reservation) {
      throw new Error("Inventory reservation not found");
    }

    await reservation.destroy({
      transaction,
    });
  }

      // ═══════════════════════════════════════════════════
    // PRIVATE: بناء شرط WHERE
    // ═══════════════════════════════════════════════════

    private buildWhere(where: ReservationWhere): WhereOptions {
        
      const sequelizeWhere: WhereOptions = {};

      // المساواة
      if (where.id !== undefined) {
          sequelizeWhere['id'] = where.id;
      }

      if (where.orderId !== undefined) {
          sequelizeWhere['orderId'] = where.orderId;
      }

      if (where.orderItemId !== undefined) {
          sequelizeWhere['orderItemId'] = where.orderItemId;
      }

      if (where.inventoryId !== undefined) {
          sequelizeWhere['inventoryId'] = where.inventoryId;
      }

      if (where.variantId !== undefined) {
          sequelizeWhere['variantId'] = where.variantId;
      }

      if (where.warehouseId !== undefined) {
          sequelizeWhere['warehouseId'] = where.warehouseId;
      }

      if (where.companyId !== undefined) {
          sequelizeWhere['companyId'] = where.companyId;
      }

      if (where.status !== undefined) {
          sequelizeWhere['status'] = where.status;
      }

      // الاستبعاد (Not Equal)
      if (where.statusNot !== undefined) {
          sequelizeWhere['status'] = {
              [Op.ne]: where.statusNot
          };
      }

      // فلترة بالتاريخ
      if (where.createdAtFrom || where.createdAtTo) {
          const dateFilter: any = {};
          
          if (where.createdAtFrom) {
              dateFilter[Op.gte] = where.createdAtFrom;
          }
          
          if (where.createdAtTo) {
              dateFilter[Op.lte] = where.createdAtTo;
          }
          
          sequelizeWhere['createdAt'] = dateFilter;
      }

      return sequelizeWhere;
  }
}