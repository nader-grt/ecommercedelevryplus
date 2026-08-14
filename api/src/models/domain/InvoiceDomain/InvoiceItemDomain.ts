export interface IInvoiceItemDomain {
    id?: number;
  
    productId: number;
    variantId?: number | null;
  
    productName: string;
    sku?: string | null;
  
    quantity: number;
  
    unitPrice: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
  }
  
  export default class InvoiceItemDomain {
    private readonly _id?: number;
  
    private readonly _productId: number;
    private readonly _variantId?: number | null;
  
    private readonly _productName: string;
    private readonly _sku?: string | null;
  
    private readonly _quantity: number;
  
    private readonly _unitPrice: number;
    private readonly _discountAmount: number;
    private readonly _taxAmount: number;
    private readonly _totalAmount: number;
  
    constructor(data: IInvoiceItemDomain) {
      if (!data.productId) {
        throw new Error("InvoiceItem productId is required");
      }
  
      if (!data.productName) {
        throw new Error("InvoiceItem productName is required");
      }
  
      if (!Number.isInteger(data.quantity) || data.quantity <= 0) {
        throw new Error("InvoiceItem quantity must be greater than 0");
      }
  
      if (data.unitPrice < 0) {
        throw new Error("InvoiceItem unitPrice cannot be negative");
      }
  
      if (data.discountAmount < 0) {
        throw new Error(
          "InvoiceItem discountAmount cannot be negative"
        );
      }
  
      if (data.taxAmount < 0) {
        throw new Error(
          "InvoiceItem taxAmount cannot be negative"
        );
      }
  
      this._id = data.id;
  
      this._productId = data.productId;
      this._variantId = data.variantId ?? null;
  
      this._productName = data.productName;
      this._sku = data.sku ?? null;
  
      this._quantity = data.quantity;
  
      this._unitPrice = data.unitPrice;
      this._discountAmount = data.discountAmount;
      this._taxAmount = data.taxAmount;
  
      this._totalAmount = this.calculateTotal();
    }
  
    private calculateTotal(): number {
      const subtotal =
        this._quantity * this._unitPrice;
  
      return (
        subtotal -
        this._discountAmount +
        this._taxAmount
      );
    }
  
    public get id(): number | undefined {
      return this._id;
    }
  
    public get productId(): number {
      return this._productId;
    }
  
    public get variantId(): number | null | undefined {
      return this._variantId;
    }
  
    public get productName(): string {
      return this._productName;
    }
  
    public get sku(): string | null | undefined {
      return this._sku;
    }
  
    public get quantity(): number {
      return this._quantity;
    }
  
    public get unitPrice(): number {
      return this._unitPrice;
    }
  
    public get discountAmount(): number {
      return this._discountAmount;
    }
  
    public get taxAmount(): number {
      return this._taxAmount;
    }
  
    public get totalAmount(): number {
      return this._totalAmount;
    }
  
    public toJSON(): IInvoiceItemDomain {
      return {
        id: this._id,
  
        productId: this._productId,
        variantId: this._variantId,
  
        productName: this._productName,
        sku: this._sku,
  
        quantity: this._quantity,
  
        unitPrice: this._unitPrice,
        discountAmount: this._discountAmount,
        taxAmount: this._taxAmount,
  
        totalAmount: this._totalAmount,
      };
    }
  }