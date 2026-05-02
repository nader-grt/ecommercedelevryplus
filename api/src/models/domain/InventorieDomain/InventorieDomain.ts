import InventoryMovementDomain from "../InventoryMovementDomain/InventoryMovementDomain";

export default class InventorieDomain {
  private _id: number | any;
  private _variantId: number;
  private _warehouseId: number;
  private _companyId: number;

  private _quantity: number;
  private _reserved: number;

  private _movements: InventoryMovementDomain[] = [];

  constructor(props: {
    id?: number;
    variantId: number;
    warehouseId: number;
    companyId: number;
    quantity?: number;
    reserved?: number;
  }) {
    this._id = props.id ?? null;
    this._variantId = props.variantId;
    this._warehouseId = props.warehouseId;
    this._companyId = props.companyId;

    this._quantity = props.quantity ?? 0;
    this._reserved = props.reserved ?? 0;

    this.validateState();
  }

  // =========================
  // VALIDATION
  // =========================

  private validateState() {
    if (this._quantity < 0) throw new Error("Invalid quantity");
    if (this._reserved < 0) throw new Error("Invalid reserved");
    if (this._reserved > this._quantity) {
      throw new Error("Reserved cannot exceed quantity");
    }
  }

  // =========================
  // GETTERS
  // =========================

  get id() {
    return this._id;
  }

  get quantity() {
    return this._quantity;
  }

  get reserved() {
    return this._reserved;
  }

  get available() {
    return this._quantity - this._reserved;
  }

  get companyId() {
    return this._companyId;
  }

  // =========================
  // BUSINESS METHODS
  // =========================

  addStock(amount: number, userId?: number) {
    if (amount <= 0) throw new Error("Invalid amount");

    this._quantity += amount;

    this._movements.push(
      InventoryMovementDomain.in(
        this._variantId,
        this._warehouseId,
        amount,
        userId
      )
    );
  }

  reserveStock(amount: number, userId?: number) {
    if (amount <= 0) throw new Error("Invalid amount");

    if (amount > this.available) {
      throw new Error("Not enough stock");
    }

    this._reserved += amount;

    this._movements.push(
      InventoryMovementDomain.reserve(
        this._variantId,
        this._warehouseId,
        amount,
        userId
      )
    );
  }

  confirmSale(amount: number, userId?: number) {
    if (amount <= 0) throw new Error("Invalid amount");

    if (amount > this._reserved) {
      throw new Error("Not enough reserved stock");
    }

    this._reserved -= amount;
    this._quantity -= amount;

    this._movements.push(
      InventoryMovementDomain.sale(
        this._variantId,
        this._warehouseId,
        amount,
        userId
      )
    );
  }

  releaseReserved(amount: number, userId?: number) {
    if (amount <= 0) throw new Error("Invalid amount");

    if (amount > this._reserved) {
      throw new Error("Invalid release");
    }

    this._reserved -= amount;

    this._movements.push(
      InventoryMovementDomain.release(
        this._variantId,
        this._warehouseId,
        amount,
        userId
      )
    );
  }

  adjustStock(amount: number, note?: string, userId?: number) {
    if (amount === 0) throw new Error("Invalid adjustment");

    this._quantity += amount;

    if (this._quantity < 0) {
      throw new Error("Stock cannot be negative");
    }

    this._movements.push(
      InventoryMovementDomain.adjustment(
        this._variantId,
        this._warehouseId,
        Math.abs(amount),
        note,
        userId
      )
    );
  }

  transferTo(
    targetWarehouseId: number,
    amount: number,
    userId?: number
  ) {
    if (amount <= 0) throw new Error("Invalid amount");

    if (amount > this.available) {
      throw new Error("Not enough stock");
    }

    this._quantity -= amount;

    this._movements.push(
      InventoryMovementDomain.transfer(
        this._variantId,
        this._warehouseId,
        targetWarehouseId,
        amount,
        userId
      )
    );
  }

  // =========================
  // MOVEMENTS HANDLING
  // =========================

  pullMovements(): InventoryMovementDomain[] {
    const data = [...this._movements];
    this._movements = [];
    return data;
  }

  // =========================
  // EXPORT
  // =========================

  toJSON() {
    return {
      id: this._id,
      variantId: this._variantId,
      warehouseId: this._warehouseId,
      companyId: this._companyId,
      quantity: this._quantity,
      reserved: this._reserved,
      available: this.available,
    };
  }
}