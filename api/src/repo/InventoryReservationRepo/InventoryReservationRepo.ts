import { Transaction } from "sequelize";
import { InventoryReservation } from "../../models/main";

import IInventoryReservationRepo, {
  CreateReservationDTO,
} from "./IInventoryReservationRepo";

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
}