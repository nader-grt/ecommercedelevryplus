export type MovementType =
  | "IN"
  | "SALE"
  | "RESERVE"
  | "RELEASE"
  | "ADJUSTMENT"
  | "TRANSFER";

export default class InventoryMovementDomain {
  private _variantId: number;
  private _warehouseId: number;
  private _type: MovementType;
  private _quantity: number;
  private _userId?: number;
  private _note?: string;
    // =========================
  // GETTERS
  // =========================

  get variantId(): number { return this._variantId; }
  get warehouseId(): number { return this._warehouseId; }
  get type(): MovementType { return this._type; }
  get quantity(): number { return this._quantity; }
  get userId(): number | undefined { return this._userId; }
  get note(): string | undefined { return this._note; }

  private constructor(props: {
    variantId: number;
    warehouseId: number;
    type: MovementType;
    quantity: number;
    userId?: number;
    note?: string;
  }) {
    if (props.quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    this._variantId = props.variantId;
    this._warehouseId = props.warehouseId;
    this._type = props.type;
    this._quantity = props.quantity;
    this._userId = props.userId;
    this._note = props.note;
  }

  // =========================
  // FACTORIES
  // =========================

  static in(variantId: number, warehouseId: number, qty: number, userId?: number) {
    return new InventoryMovementDomain({
      variantId,
      warehouseId,
      type: "IN",
      quantity: qty,
      userId,
    });
  }

  static sale(variantId: number, warehouseId: number, qty: number, userId?: number) {
    return new InventoryMovementDomain({
      variantId,
      warehouseId,
      type: "SALE",
      quantity: qty,
      userId,
    });
  }

  static reserve(variantId: number, warehouseId: number, qty: number, userId?: number) {
    return new InventoryMovementDomain({
      variantId,
      warehouseId,
      type: "RESERVE",
      quantity: qty,
      userId,
    });
  }

  static release(variantId: number, warehouseId: number, qty: number, userId?: number) {
    return new InventoryMovementDomain({
      variantId,
      warehouseId,
      type: "RELEASE",
      quantity: qty,
      userId,
    });
  }

  static adjustment(
    variantId: number,
    warehouseId: number,
    qty: number,
    note?: string,
    userId?: number
  ) {
    return new InventoryMovementDomain({
      variantId,
      warehouseId,
      type: "ADJUSTMENT",
      quantity: qty,
      userId,
      note,
    });
  }

  static transfer(
    variantId: number,
    fromWarehouseId: number,
    toWarehouseId: number,
    qty: number,
    userId?: number
  ) {
    return new InventoryMovementDomain({
      variantId,
      warehouseId: fromWarehouseId,
      type: "TRANSFER",
      quantity: qty,
      userId,
      note: `TO:${toWarehouseId}`,
    });
  }

  // =========================
  // GETTERS
  // =========================

  toJSON() {
    return {
      variantId: this._variantId,
      warehouseId: this._warehouseId,
      type: this._type,
      quantity: this._quantity,
      userId: this._userId,
      note: this._note,
    };
  }
}