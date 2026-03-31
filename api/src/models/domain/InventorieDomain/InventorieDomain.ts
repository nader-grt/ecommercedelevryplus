export default class InventorieDomain {
    private _id: number | null;
    private _variantId: number;
    private _warehouseId: number;
    private _quantity: number;
    private _reserved: number;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _companyId!: number;
  
    constructor(props: {
      id?: number;
      variantId: number;
      warehouseId: number;
      companyId?: number;
      quantity?: number;
      reserved?: number;
      createdAt?: Date;
      updatedAt?: Date;
    }) {
      this._id = props.id ?? null;
      this._variantId = props.variantId;
      this._warehouseId = props.warehouseId;
      //  this._companyId = props.companyId;
      this._quantity = props.quantity ?? 0;
      this._reserved = props.reserved ?? 0;
      this._createdAt = props.createdAt ?? new Date();
      this._updatedAt = props.updatedAt ?? new Date();
    }
  
    // ======== Getters ========
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
  
    get createdAt() {
      return this._createdAt;
    }
  
    get updatedAt() {
      return this._updatedAt;
    }
  
    // ======== Business Methods ========
  
    // Add stock quantity
    addStock(amount: number) {
      if (amount <= 0) throw new Error("The amount to add must be greater than zero");
      this._quantity += amount;
      this._updatedAt = new Date();
    }
  
    // Remove stock quantity
    removeStock(amount: number) {
      if (amount <= 0) throw new Error("The amount to remove must be greater than zero");
      if (amount > this._quantity) throw new Error("The requested amount exceeds available stock");
      this._quantity -= amount;
      this._updatedAt = new Date();
    }
  
    // Reserve stock (for pending orders)
    reserveStock(amount: number) {
      if (amount <= 0) throw new Error("The amount to reserve must be greater than zero");
      if (amount > this._quantity - this._reserved) throw new Error("Not enough stock available to reserve");
      this._reserved += amount;
      this._updatedAt = new Date();
    }
  
    // Release reserved stock
    releaseReserved(amount: number) {
      if (amount <= 0) throw new Error("The amount to release must be greater than zero");
      if (amount > this._reserved) throw new Error("The amount to release exceeds reserved stock");
      this._reserved -= amount;
      this._updatedAt = new Date();
    }
  }