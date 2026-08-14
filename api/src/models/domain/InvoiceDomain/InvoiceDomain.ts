import InvoiceItemDomain, {
    IInvoiceItemDomain,
  } from "./InvoiceItemDomain";
  
  export type InvoiceStatus =
    | "DRAFT"
    | "ISSUED"
    | "CANCELLED";
  
  export interface IInvoiceDomain {
    id?: number;
    orderId: number;
    invoiceNumber: string;
    status?: InvoiceStatus;
    issuedAt?: Date;
    items?: IInvoiceItemDomain[];
  }
  
  export default class InvoiceDomain {
    private readonly _id?: number;
  
    private readonly _orderId: number;
    private readonly _invoiceNumber: string;
  
    private _status: InvoiceStatus;
  
    private readonly _issuedAt: Date;
  
    private readonly _items: InvoiceItemDomain[] = [];
  
    constructor(data: IInvoiceDomain) {
      if (!data.orderId) {
        throw new Error("Invoice orderId is required");
      }
  
      if (!data.invoiceNumber) {
        throw new Error(
          "Invoice invoiceNumber is required"
        );
      }
  
      this._id = data.id;
  
      this._orderId = data.orderId;
      this._invoiceNumber = data.invoiceNumber;
  
      this._status = data.status ?? "DRAFT";
  
      this._issuedAt =
        data.issuedAt ?? new Date();
  
      if (data.items) {
        for (const item of data.items) {
          this.addItem(item);
        }
      }
    }
  
    // ==========================================
    // Invoice Items
    // ==========================================
  
    public addItem(
      data: IInvoiceItemDomain
    ): InvoiceItemDomain {
      if (
        data.quantity <= 0
      ) {
        throw new Error(
          "Invoice item quantity must be greater than 0"
        );
      }
  
      const item = new InvoiceItemDomain(data);
  
      this._items.push(item);
  
      return item;
    }
  
    // ==========================================
    // Remove Item
    // ==========================================
  
    public removeItem(
      productId: number,
      variantId?: number | null
    ): void {
      const index = this._items.findIndex(
        (item) =>
          item.productId === productId &&
          item.variantId ===
            (variantId ?? null)
      );
  
      if (index === -1) {
        throw new Error(
          "Invoice item not found"
        );
      }
  
      if (this._status === "ISSUED") {
        throw new Error(
          "Cannot remove item from an issued invoice"
        );
      }
  
      this._items.splice(index, 1);
    }
  
    // ==========================================
    // Issue Invoice
    // ==========================================
  
    public issue(): void {
      if (this._items.length === 0) {
        throw new Error(
          "Cannot issue an invoice without items"
        );
      }
  
      if (this._status === "CANCELLED") {
        throw new Error(
          "Cannot issue a cancelled invoice"
        );
      }
  
      this._status = "ISSUED";
    }
  
    // ==========================================
    // Cancel Invoice
    // ==========================================
  
    public cancel(): void {
      if (this._status === "CANCELLED") {
        throw new Error(
          "Invoice is already cancelled"
        );
      }
  
      this._status = "CANCELLED";
    }
  
    // ==========================================
    // Calculate Total
    // ==========================================
  
    public getTotalAmount(): number {
      return this._items.reduce(
        (total, item) =>
          total + item.totalAmount,
        0
      );
    }
  
    // ==========================================
    // Getters
    // ==========================================
  
    public get id(): number | undefined {
      return this._id;
    }
  
    public get orderId(): number {
      return this._orderId;
    }
  
    public get invoiceNumber(): string {
      return this._invoiceNumber;
    }
  
    public get status(): InvoiceStatus {
      return this._status;
    }
  
    public get issuedAt(): Date {
      return this._issuedAt;
    }
  
    public get items(): readonly InvoiceItemDomain[] {
      return this._items;
    }
  
    // ==========================================
    // JSON
    // ==========================================
  
    public toJSON(): IInvoiceDomain {
      return {
        id: this._id,
  
        orderId: this._orderId,
  
        invoiceNumber:
          this._invoiceNumber,
  
        status: this._status,
  
        issuedAt: this._issuedAt,
  
        items: this._items.map(
          (item) => item.toJSON()
        ),
      };
    }
  }