export interface InventoryAuditProps {
    id?: number;
    variantId: number;
    warehouseId: number;
    systemQuantity: number;
    actualQuantity: number;
    reason?: string;
    userId?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export default class InventoryAuditDomain {
    private _id?: number;
    private _variantId: number;
    private _warehouseId: number;
    private _systemQuantity: number;
    private _actualQuantity: number;
    private _reason?: string;
    private _userId?: number;
    private _createdAt?: Date;
    private _updatedAt?: Date;
  
    constructor(props: InventoryAuditProps) {
      this._id = props.id;
      this._variantId = props.variantId;
      this._warehouseId = props.warehouseId;
      this._systemQuantity = props.systemQuantity;
      this._actualQuantity = props.actualQuantity;
      this._reason = props.reason;
      this._userId = props.userId;
      this._createdAt = props.createdAt;
      this._updatedAt = props.updatedAt;
    }
  
    get id(): number | undefined {
      return this._id;
    }
  
    get variantId(): number {
      return this._variantId;
    }
  
    get warehouseId(): number {
      return this._warehouseId;
    }
  
    get systemQuantity(): number {
      return this._systemQuantity;
    }
  
    get actualQuantity(): number {
      return this._actualQuantity;
    }
  
    /**
     * Business Rule:
     * الفرق بين الكمية الفعلية والكمية المسجلة.
     * موجب => زيادة
     * سالب => نقص
     * صفر => لا يوجد فرق
     */
    get difference(): number {
      return this._actualQuantity - this._systemQuantity;
    }
  
    get reason(): string | undefined {
      return this._reason;
    }
  
    get userId(): number | undefined {
      return this._userId;
    }
  
    get isIncrease(): boolean {
      return this.difference > 0;
    }
  
    get isDecrease(): boolean {
      return this.difference < 0;
    }
  
    get isEqual(): boolean {
      return this.difference === 0;
    }
  
    toJSON() {
      return {
        id: this._id,
        variantId: this._variantId,
        warehouseId: this._warehouseId,
        systemQuantity: this._systemQuantity,
        actualQuantity: this._actualQuantity,
        difference: this.difference,
        reason: this._reason,
        userId: this._userId,
        createdAt: this._createdAt,
        updatedAt: this._updatedAt,
      };
    }
  }