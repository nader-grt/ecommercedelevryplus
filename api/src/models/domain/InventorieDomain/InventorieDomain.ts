import InventoryMovementDomain from "../InventoryMovementDomain/InventoryMovementDomain";

// export default class InventorieDomain {
//   private _id: number | any;
//   private _variantId: number;
//   private _warehouseId: number;
//   private _companyId: number;

//   private _quantity: number;
//   private _reserved: number;

//   private _movements: InventoryMovementDomain[] = [];

//   constructor(props: {
//     id?: number;
//     variantId: number;
//     warehouseId: number;
//     companyId: number;
//     quantity?: number;
//     reserved?: number;
//   }) {
//     this._id = props.id ?? null;
//     this._variantId = props.variantId;
//     this._warehouseId = props.warehouseId;
//     this._companyId = props.companyId;

//     this._quantity = props.quantity ?? 0;
//     this._reserved = props.reserved ?? 0;

//     this.validateState();
//   }

//   // ===================================================
//   // VALIDATION
//   // ===================================================

//   private validateState() {
//     if (this._quantity < 0)
//       throw new Error("Quantity cannot be negative");

//     if (this._reserved < 0)
//       throw new Error("Reserved cannot be negative");

//     if (this._reserved > this._quantity)
//       throw new Error("Reserved cannot exceed quantity");
//   }

//   private validateAmount(amount: number) {
//     if (amount <= 0)
//       throw new Error("Quantity must be greater than zero");
//   }

//   // ===================================================
//   // GETTERS
//   // ===================================================

//   get id() {
//     return this._id;
//   }

//   get variantId() {
//     return this._variantId;
//   }

//   get warehouseId() {
//     return this._warehouseId;
//   }

//   get companyId() {
//     return this._companyId;
//   }

//   get quantity() {
//     return this._quantity;
//   }

//   get reserved() {
//     return this._reserved;
//   }

//   get available() {
//     return this._quantity - this._reserved;
//   }

//   // ===================================================
//   // HELPERS
//   // ===================================================

//   hasAvailable(quantity: number): boolean {
//     return this.available >= quantity;
//   }

//   hasReserved(quantity: number): boolean {
//     return this._reserved >= quantity;
//   }

//   setQuantity(quantity: number) {
//     if (quantity < 0)
//       throw new Error("Quantity cannot be negative");

//     if (quantity < this._reserved)
//       throw new Error("Quantity cannot be less than reserved");

//     this._quantity = quantity;
//   }

//   // ===================================================
//   // BUSINESS
//   // ===================================================

//   addStock(amount: number, userId?: number) {
//     this.validateAmount(amount);

//     this._quantity += amount;

//     this._movements.push(
//       InventoryMovementDomain.in(
//         this._variantId,
//         this._warehouseId,
//         amount,
//         userId
//       )
//     );
//   }

//   removeStock(amount: number) {
//     this.validateAmount(amount);

//     if (!this.hasAvailable(amount))
//       throw new Error("Not enough stock");

//     this._quantity -= amount;
//   }

//   reserveStock(amount: number, userId?: number) {
//     this.validateAmount(amount);

//     if (!this.hasAvailable(amount))
//       throw new Error("Not enough stock");

//     this._reserved += amount;

//     this._movements.push(
//       InventoryMovementDomain.reserve(
//         this._variantId,
//         this._warehouseId,
//         amount,
//         userId
//       )
//     );
//   }

//   releaseReserved(amount: number, userId?: number) {
//     this.validateAmount(amount);

//     if (!this.hasReserved(amount))
//       throw new Error("Reserved quantity is insufficient");

//     this._reserved -= amount;

//     this._movements.push(
//       InventoryMovementDomain.release(
//         this._variantId,
//         this._warehouseId,
//         amount,
//         userId
//       )
//     );
//   }

//   // alias for new UseCases
//   releaseStock(amount: number, userId?: number) {
//     this.releaseReserved(amount, userId);
//   }

//   consumeReserved(amount: number, userId?: number) {
//     this.validateAmount(amount);

//     if (!this.hasReserved(amount))
//       throw new Error("Reserved quantity is insufficient");

//     this._reserved -= amount;
//     this._quantity -= amount;

//     this._movements.push(
//       InventoryMovementDomain.sale(
//         this._variantId,
//         this._warehouseId,
//         amount,
//         userId
//       )
//     );
//   }

//   // backward compatibility
//   confirmSale(amount: number, userId?: number) {
//     this.consumeReserved(amount, userId);
//   }

//   adjustStock(amount: number, note?: string, userId?: number) {
//     if (amount === 0)
//       throw new Error("Invalid adjustment");

//     this._quantity += amount;

//     if (this._quantity < 0)
//       throw new Error("Stock cannot be negative");

//     this.validateState();

//     this._movements.push(
//       InventoryMovementDomain.adjustment(
//         this._variantId,
//         this._warehouseId,
//         Math.abs(amount),
//         note,
//         userId
//       )
//     );
//   }

//   transferTo(
//     targetWarehouseId: number,
//     amount: number,
//     userId?: number
//   ) {
//     this.validateAmount(amount);

//     if (!this.hasAvailable(amount))
//       throw new Error("Not enough stock");

//     this._quantity -= amount;

//     this._movements.push(
//       InventoryMovementDomain.transfer(
//         this._variantId,
//         this._warehouseId,
//         targetWarehouseId,
//         amount,
//         userId
//       )
//     );
//   }

//   // ===================================================
//   // EVENTS
//   // ===================================================

//   pullMovements(): InventoryMovementDomain[] {
//     const result = [...this._movements];
//     this._movements = [];
//     return result;
//   }

//   // ===================================================
//   // EXPORT
//   // ===================================================

//   toJSON() {
//     return {
//       id: this._id,
//       variantId: this._variantId,
//       warehouseId: this._warehouseId,
//       companyId: this._companyId,
//       quantity: this._quantity,
//       reserved: this._reserved,
//       available: this.available,
//     };
//   }
// }



// ===================================================
// CUSTOM ERROR - أخطاء مخصصة
// ===================================================

export class InventoryError extends Error {
  constructor(
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = 'InventoryError';
  }
}

// ===================================================
// INVENTORY DOMAIN - نطاق المخزون
// ===================================================

export default class InventorieDomain {
  // ── الخصائص الأساسية (readonly = لا تتغير بعد الإنشاء) ──
  private readonly _id: number;
  private readonly _companyId: number;
  private readonly _variantId: number;
  private readonly _warehouseId: number;

  // ── الخصائص القابلة للتغيير ──
  private _quantity: number;    // الكمية الفعلية في المستودع
  private _reserved: number;    // الكمية المحجوزة للطلبات

  // ── الحركات المتراكمة (تُسجل داخلياً ثم تُستخرج) ──
  private _movements: InventoryMovementDomain[] = [];

  // ===================================================
  // CONSTRUCTOR - البناء
  // ===================================================

  constructor(props: {
    id?: number;
    companyId: number;
    variantId: number;
    warehouseId: number;
    quantity?: number;
    reserved?: number;
  }) {
    this._id = props.id ?? 0;
    this._companyId = props.companyId;
    this._variantId = props.variantId;
    this._warehouseId = props.warehouseId;
    this._quantity = props.quantity ?? 0;
    this._reserved = props.reserved ?? 0;

    // التحقق فوراً بعد البناء
    this.validateState();
  }

  // ===================================================
  // GETTERS - قراءة فقط
  // ===================================================

  get id(): number { return this._id; }
  get companyId(): number { return this._companyId; }
  get variantId(): number { return this._variantId; }
  get warehouseId(): number { return this._warehouseId; }
  get quantity(): number { return this._quantity; }
  get reserved(): number { return this._reserved; }

  /** الكمية المتاحة للحجز = الكمية - المحجوز */
  get available(): number {
    return this._quantity - this._reserved;
  }

  /** هل المخزون محجوز بالكامل؟ */
  get isFullyReserved(): boolean {
    return this._reserved >= this._quantity;
  }

  // ===================================================
  // VALIDATION - التحقق
  // ===================================================

  /** التحقق من حالة المخزون الكاملة */
  private validateState(): void {
    if (this._quantity < 0) {
      throw new InventoryError(
        'QUANTITY_NEGATIVE',
        `الكمية لا يمكن أن تكون سالبة: ${this._quantity}`
      );
    }

    if (this._reserved < 0) {
      throw new InventoryError(
        'RESERVED_NEGATIVE',
        `المحجوز لا يمكن أن يكون سالباً: ${this._reserved}`
      );
    }

    if (this._reserved > this._quantity) {
      throw new InventoryError(
        'RESERVED_EXCEEDS_QUANTITY',
        `المحجوز (${this._reserved}) لا يمكن أن يتجاوز الكمية (${this._quantity})`
      );
    }
  }

  /** التحقق من صحة المبلغ */
  private validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new InventoryError(
        'AMOUNT_INVALID',
        `المبلغ يجب أن يكون أكبر من صفر: ${amount}`
      );
    }
  }

  // ===================================================
  // QUERIES - استعلامات (لا تغير الحالة)
  // ===================================================

  /** هل يوجد مخزون كافٍ متاح؟ */
  hasAvailable(amount: number): boolean {
    return this.available >= amount;
  }

  /** هل يوجد محجوز كافٍ؟ */
  hasReserved(amount: number): boolean {
    return this._reserved >= amount;
  }

  // ===================================================
  // COMMANDS - أوامر (تغير الحالة)
  // ===================================================

  /**
   * إضافة مخزون جديد (استلام بضاعة)
   * 
   * @param amount الكمية المضافة
   * @param userId معرف المستخدم (للتتبع)
   */
  addStock(amount: number, userId?: number): void {
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

    this.validateState();
  }

  /**
   * إزالة مخزون (تالف، فقدان)
   * 
   * @param amount الكمية المزالة
   */
  removeStock(amount: number): void {
    this.validateAmount(amount);

    if (!this.hasAvailable(amount)) {
      throw new InventoryError(
        'INSUFFICIENT_STOCK',
        `المخزون غير كافٍ للإزالة. المتاح: ${this.available}, المطلوب: ${amount}`
      );
    }

    this._quantity -= amount;

    this.validateState();
  }

  /**
   * حجز مخزون لطلب
   * 
   * @param amount الكمية المراد حجزها
   * @param userId معرف المستخدم
   */
  reserve(amount: number, userId?: number): void {
    this.validateAmount(amount);

    if (!this.hasAvailable(amount)) {
      throw new InventoryError(
        'INSUFFICIENT_STOCK',
        `المخزون غير كافٍ للحجز. المتاح: ${this.available}, المطلوب: ${amount}`
      );
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

    this.validateState();
  }

  /**
   * إفراج عن مخزون محجوز (إلغاء طلب)
   * 
   * @param amount الكمية المراد إفراجها
   * @param userId معرف المستخدم
   */
  release(amount: number, userId?: number): void {
    this.validateAmount(amount);

    if (!this.hasReserved(amount)) {
      throw new InventoryError(
        'RELEASE_EXCEEDS_RESERVED',
        `لا يمكن إفراج ${amount}. المحجوز: ${this._reserved}`
      );
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

    this.validateState();
  }

  /**
   * تأكيد حجز وخصمه من المخزون (شحن الطلب)
   * 
   * @param amount الكمية المراد تأكيدها
   * @param userId معرف المستخدم
   */
  commit(amount: number, userId?: number): void {
    this.validateAmount(amount);

    if (!this.hasReserved(amount)) {
      throw new InventoryError(
        'COMMIT_EXCEEDS_RESERVED',
        `لا يمكن تأكيد ${amount}. المحجوز: ${this._reserved}`
      );
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

    this.validateState();
  }

  /**
   * تعديل المخزون (جرد، تلف)
   * 
   * @param amount مبلغ التعديل (موجب أو سالب)
   * @param note ملاحظة التعديل
   * @param userId معرف المستخدم
   */
  adjust(amount: number, note?: string, userId?: number): void {
    if (amount === 0) {
      throw new InventoryError(
        'ADJUSTMENT_ZERO',
        'مبلغ التعديل لا يمكن أن يكون صفراً'
      );
    }

    const newQuantity = this._quantity + amount;

    if (newQuantity < this._reserved) {
      throw new InventoryError(
        'ADJUSTMENT_BELOW_RESERVED',
        `التعديل يجعل الكمية (${newQuantity}) أقل من المحجوز (${this._reserved})`
      );
    }

    if (newQuantity < 0) {
      throw new InventoryError(
        'ADJUSTMENT_NEGATIVE',
        `التعديل يجعل الكمية سالبة: ${newQuantity}`
      );
    }

    this._quantity = newQuantity;

    this._movements.push(
      InventoryMovementDomain.adjustment(
        this._variantId,
        this._warehouseId,
        Math.abs(amount),
        note,
        userId
      )
    );

    this.validateState();
  }

  /**
   * نقل مخزون لمستودع آخر
   * 
   * @param targetWarehouseId المستودع الوجهة
   * @param amount الكمية المنقولة
   * @param userId معرف المستخدم
   */
  transferTo(
    targetWarehouseId: number,
    amount: number,
    userId?: number
  ): void {
    this.validateAmount(amount);

    if (!this.hasAvailable(amount)) {
      throw new InventoryError(
        'TRANSFER_EXCEEDS_AVAILABLE',
        `المخزون غير كافٍ للنقل. المتاح: ${this.available}, المطلوب: ${amount}`
      );
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

    this.validateState();
  }

  /**
   * تعيين الكمية يدوياً (استيراد، تهيئة)
   * 
   * @param quantity الكمية الجديدة
   */
  setQuantity(quantity: number): void {
    if (quantity < 0) {
      throw new InventoryError(
        'QUANTITY_NEGATIVE',
        `الكمية لا يمكن أن تكون سالبة: ${quantity}`
      );
    }

    if (quantity < this._reserved) {
      throw new InventoryError(
        'QUANTITY_BELOW_RESERVED',
        `الكمية (${quantity}) لا يمكن أن تكون أقل من المحجوز (${this._reserved})`
      );
    }

    this._quantity = quantity;
    this.validateState();
  }

  // ===================================================
  // EVENTS - الأحداث (الحركات)
  // ===================================================

  /**
   * استخراج الحركات المتراكمة وإفراغها
   * 
   * @returns مصفوفة الحركات
   */
  pullMovements(): InventoryMovementDomain[] {
    const result = [...this._movements];
    this._movements = [];
    return result;
  }

  /**
   * هل يوجد حركات معلقة؟
   */
  hasPendingMovements(): boolean {
    return this._movements.length > 0;
  }

  // ===================================================
  // SERIALIZATION - التحويل
  // ===================================================

  /** تحويل لكائن JSON */
  toJSON() {
    return {
      id: this._id,
      companyId: this._companyId,
      variantId: this._variantId,
      warehouseId: this._warehouseId,
      quantity: this._quantity,
      reserved: this._reserved,
      available: this.available,
    };
  }

  /** تحويل لحالة قابلة للحفظ */
  toState() {
    return {
      id: this._id,
      companyId: this._companyId,
      variantId: this._variantId,
      warehouseId: this._warehouseId,
      quantity: this._quantity,
      reserved: this._reserved,
    };
  }
}
























/**
 


/*


 xport class InventoryDomain {
    constructor(
        private readonly id: number,
        private _quantity: number,      // Actual physical stock
        private _reserved: number,    // Reserved for orders
        private _variantId: number,
        private _warehouseId: number
    ) {}

    // Getters - Read-only access
    get available(): number {
        return this._quantity - this._reserved;
    }

    get quantity(): number { return this._quantity; }
    get reserved(): number { return this._reserved; }
    get isFullyReserved(): boolean {
        return this._reserved >= this._quantity;
    }

    /**
     * Reserve stock for an order
     * English: Throws if not enough stock
     * العربية: يرمي خطأ إذا لم يكن المخزون كافياً
     */
  //   reserve(amount: number): void {
  //     if (amount <= 0) {
  //         throw new InventoryError(
  //             'RESERVE_AMOUNT_INVALID',
  //             'Reservation amount must be positive'
  //         );
  //     }
  //     if (amount > this.available) {
  //         throw new InventoryError(
  //             'INSUFFICIENT_STOCK',
  //             `Cannot reserve ${amount}. Available: ${this.available}`
  //         );
  //     }
  //     this._reserved += amount;
  // }

  /**
   * Release reserved stock (order cancelled)
   * الإفراج عن المخزون المحجوز (إلغاء الطلب)
   */
//   release(amount: number): void {
//       if (amount > this._reserved) {
//           throw new InventoryError(
//               'RELEASE_EXCEEDS_RESERVED',
//               `Cannot release ${amount}. Reserved: ${this._reserved}`
//           );
//       }
//       this._reserved -= amount;
//   }

//   /**
//    * Commit reserved stock (order shipped)
//    * تأكيد المخزون المحجوز (تم شحن الطلب)
//    */
//   commit(amount: number): void {
//       if (amount > this._reserved) {
//           throw new InventoryError(
//               'COMMIT_EXCEEDS_RESERVED',
//               `Cannot commit ${amount}. Reserved: ${this._reserved}`
//           );
//       }
//       this._quantity -= amount;
//       this._reserved -= amount;
//   }

//   /**
//    * Adjust inventory (audit, damage, etc.)
//    * تعديل المخزون (تدقيق، تلف، إلخ)
//    */
//   adjust(newQuantity: number, reason: string): InventoryAdjustment {
//       const difference = newQuantity - this._quantity;
      
//       // Cannot adjust below reserved amount
//       // لا يمكن التعديل لأقل من المبلغ المحجوز
//       if (newQuantity < this._reserved) {
//           throw new InventoryError(
//               'ADJUSTMENT_BELOW_RESERVED',
//               `New quantity ${newQuantity} would be below reserved ${this._reserved}`
//           );
//       }

//       const adjustment = new InventoryAdjustment(
//           this._variantId,
//           this._warehouseId,
//           this._quantity,
//           newQuantity,
//           difference,
//           reason
//       );

//       this._quantity = newQuantity;
//       return adjustment;
//   }

//   /**
//    * Transfer stock to another warehouse
//    * نقل المخزون إلى مستودع آخر
//    */
//   transferOut(amount: number): InventoryTransfer {
//       if (amount > this.available) {
//           throw new InventoryError(
//               'TRANSFER_EXCEEDS_AVAILABLE',
//               `Cannot transfer ${amount}. Available: ${this.available}`
//           );
//       }
//       this._quantity -= amount;
//       return new InventoryTransfer(this._variantId, this._warehouseId, amount);
//   }

//   transferIn(amount: number): void {
//       this._quantity += amount;
//   }

//   toState(): InventoryState {
//       return {
//           id: this.id,
//           quantity: this._quantity,
//           reserved: this._reserved,
//           variantId: this._variantId,
//           warehouseId: this._warehouseId,
//           available: this.available
//       };
//   }
// }

 