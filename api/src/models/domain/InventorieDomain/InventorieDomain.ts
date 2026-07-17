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

  // ===================================================
  // VALIDATION
  // ===================================================

  private validateState() {
    if (this._quantity < 0)
      throw new Error("Quantity cannot be negative");

    if (this._reserved < 0)
      throw new Error("Reserved cannot be negative");

    if (this._reserved > this._quantity)
      throw new Error("Reserved cannot exceed quantity");
  }

  private validateAmount(amount: number) {
    if (amount <= 0)
      throw new Error("Quantity must be greater than zero");
  }

  // ===================================================
  // GETTERS
  // ===================================================

  get id() {
    return this._id;
  }

  get variantId() {
    return this._variantId;
  }

  get warehouseId() {
    return this._warehouseId;
  }

  get companyId() {
    return this._companyId;
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

  // ===================================================
  // HELPERS
  // ===================================================

  hasAvailable(quantity: number): boolean {
    return this.available >= quantity;
  }

  hasReserved(quantity: number): boolean {
    return this._reserved >= quantity;
  }

  setQuantity(quantity: number) {
    if (quantity < 0)
      throw new Error("Quantity cannot be negative");

    if (quantity < this._reserved)
      throw new Error("Quantity cannot be less than reserved");

    this._quantity = quantity;
  }

  // ===================================================
  // BUSINESS
  // ===================================================

  addStock(amount: number, userId?: number) {
    this.validateAmount(amount);

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

  removeStock(amount: number) {
    this.validateAmount(amount);

    if (!this.hasAvailable(amount))
      throw new Error("Not enough stock");

    this._quantity -= amount;
  }

  reserveStock(amount: number, userId?: number) {
    this.validateAmount(amount);

    if (!this.hasAvailable(amount))
      throw new Error("Not enough stock");

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

  releaseReserved(amount: number, userId?: number) {
    this.validateAmount(amount);

    if (!this.hasReserved(amount))
      throw new Error("Reserved quantity is insufficient");

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

  // alias for new UseCases
  releaseStock(amount: number, userId?: number) {
    this.releaseReserved(amount, userId);
  }

  consumeReserved(amount: number, userId?: number) {
    this.validateAmount(amount);

    if (!this.hasReserved(amount))
      throw new Error("Reserved quantity is insufficient");

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

  // backward compatibility
  confirmSale(amount: number, userId?: number) {
    this.consumeReserved(amount, userId);
  }

  adjustStock(amount: number, note?: string, userId?: number) {
    if (amount === 0)
      throw new Error("Invalid adjustment");

    this._quantity += amount;

    if (this._quantity < 0)
      throw new Error("Stock cannot be negative");

    this.validateState();

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
    this.validateAmount(amount);

    if (!this.hasAvailable(amount))
      throw new Error("Not enough stock");

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

  // ===================================================
  // EVENTS
  // ===================================================

  pullMovements(): InventoryMovementDomain[] {
    const result = [...this._movements];
    this._movements = [];
    return result;
  }

  // ===================================================
  // EXPORT
  // ===================================================

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