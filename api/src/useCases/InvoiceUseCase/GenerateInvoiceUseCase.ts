import { Transaction } from "sequelize";

import InvoiceDomain from "../../models/domain/InvoiceDomain/InvoiceDomain";

import IInvoiceRepo from "../../repo/InvoiceRepo/IInvoiceRepo";

import InvoiceService from "../../services/InvoiceService/InvoiceService";

interface GenerateInvoiceItemDTO {
  productId: number;
  variantId?: number | null;

  productName: string;
  sku?: string | null;

  quantity: number;

  unitPrice: number;
  discountAmount?: number;
  taxAmount?: number;
}

interface GenerateInvoiceDTO {
  orderId: number;
  items: GenerateInvoiceItemDTO[];

  transaction: Transaction;
}

export default class GenerateInvoiceUseCase {

  private _invoiceRepo: IInvoiceRepo;
  private _invoiceService: InvoiceService;

  constructor(
    invoiceRepo: IInvoiceRepo,
    invoiceService: InvoiceService
  ) {
    this._invoiceRepo = invoiceRepo;
    this._invoiceService = invoiceService;
  }

  async execute(
    dto: GenerateInvoiceDTO
  ): Promise<InvoiceDomain> {

    try {

      // ==========================================
      // 1. Validate Order
      // ==========================================

      if (!dto.orderId) {
        throw new Error(
          "Order ID is required"
        );
      }

      // ==========================================
      // 2. Validate Items
      // ==========================================

      if (
        !dto.items ||
        dto.items.length === 0
      ) {
        throw new Error(
          "Cannot generate invoice without items"
        );
      }

      // ==========================================
      // 3. Check existing Invoice
      // ==========================================

      const existingInvoice =
        await this._invoiceRepo.findByOrderId(
          dto.orderId,
          dto.transaction
        );

      if (existingInvoice) {
        throw new Error(
          `Invoice already exists for order ${dto.orderId}`
        );
      }

      // ==========================================
      // 4. Generate Invoice Number
      // ==========================================

      const invoiceNumber =
        await this._invoiceService
          .generateInvoiceNumber();

      // ==========================================
      // 5. Create Invoice Domain
      // ==========================================

      const invoice =
        new InvoiceDomain({

          orderId:
            dto.orderId,

          invoiceNumber:
            invoiceNumber,

          status:
            "DRAFT",

          issuedAt:
            new Date(),
        });

      // ==========================================
      // 6. Add Invoice Items
      // ==========================================

      for (const item of dto.items) {

        if (
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0
        ) {
          throw new Error(
            `Invalid quantity for product ${item.productId}`
          );
        }

        if (item.unitPrice < 0) {
          throw new Error(
            `Invalid price for product ${item.productId}`
          );
        }

        const discountAmount =
          item.discountAmount ?? 0;

        const taxAmount =
          item.taxAmount ?? 0;

        const totalAmount =
          item.quantity * item.unitPrice
          - discountAmount
          + taxAmount;

        // إضافة InvoiceItem إلى Aggregate
        invoice.addItem({

          productId:
            item.productId,

          variantId:
            item.variantId ?? null,

          productName:
            item.productName,

          sku:
            item.sku ?? null,

          quantity:
            item.quantity,

          unitPrice:
            item.unitPrice,

          discountAmount:
            discountAmount,

          taxAmount:
            taxAmount,

          totalAmount:
            totalAmount,
        });
      }

      // ==========================================
      // 7. Issue Invoice
      // ==========================================

      invoice.issue();

      // ==========================================
      // 8. Persist Aggregate
      // ==========================================

      const savedInvoice =
        await this._invoiceRepo.create(
          invoice,
          dto.transaction
        );

      // ==========================================
      // 9. Return
      // ==========================================

      return savedInvoice;

    } catch (error: any) {

      console.error(
        "GenerateInvoiceUseCase Error:",
        error
      );

      throw error;
    }
  }
}