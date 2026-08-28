import { Transaction } from "sequelize";

import IInvoiceRepo from "./IInvoiceRepo";

import InvoiceDomain from "../../models/domain/InvoiceDomain/InvoiceDomain";

import {
  Invoice,
  InvoiceModel,
} from "../../models/Invoice";

import {
  InvoiceItem,
  InvoiceItemModel,
} from "../../models/InvoiceItem";

export default class InvoiceRepo implements IInvoiceRepo {

  // =====================================================
  // CREATE
  // =====================================================

  // async create(
  //   invoice: InvoiceDomain,
  //   transaction?: Transaction
  // ): Promise<InvoiceDomain> {

  //   const invoiceModel = await Invoice.create(
  //     {
  //       orderId: invoice.orderId,
  //       invoiceNumber: invoice.invoiceNumber,
  //       status: invoice.status,
  //       issuedAt: invoice.issuedAt,
  //     },
  //     {
  //       transaction,
  //     }
  //   );

  //   // Create InvoiceItems
  //   for (const item of invoice.items) {

  //     await InvoiceItem.create(
  //       {
  //         invoiceId: invoiceModel.id,

  //         productId: item.productId,
  //         variantId: item.variantId,

  //         productName: item.productName,
  //         sku: item.sku,

  //         quantity: item.quantity,

  //         unitPrice: item.unitPrice,
  //         discountAmount: item.discountAmount,
  //         taxAmount: item.taxAmount,
  //         totalAmount: item.totalAmount,
  //       },
  //       {
  //         transaction,
  //       }
  //     );
  //   }

  //   return invoice;
  // }

  // =====================================================
// CREATE
// =====================================================

async create(
  invoice: InvoiceDomain,
  transaction?: Transaction
): Promise<InvoiceDomain> {

  // ===================================================
  // 1. Create Invoice
  // ===================================================

  const invoiceModel =
    await Invoice.create(
      {
        orderId:
          invoice.orderId,

        invoiceNumber:
          invoice.invoiceNumber,

        status:
          invoice.status,

        issuedAt:
          invoice.issuedAt,
      },
      {
        transaction,
      }
    );


  // ===================================================
  // 2. Create InvoiceItems
  // ===================================================

  for (
    const item
    of invoice.items
  ) {

    await InvoiceItem.create(
      {
        invoiceId:
          invoiceModel.id,

        productId:
          item.productId,

        variantId:
          item.variantId,

        productName:
          item.productName,

        sku:
          item.sku,

        quantity:
          item.quantity,

        unitPrice:
          item.unitPrice,

        discountAmount:
          item.discountAmount,

        taxAmount:
          item.taxAmount,

        totalAmount:
          item.totalAmount,
      },
      {
        transaction,
      }
    );
  }


  // ===================================================
  // 3. Rebuild Domain with DB ID
  // ===================================================

  return new InvoiceDomain({

    id:
      invoiceModel.id,

    orderId:
      invoiceModel.orderId,

    invoiceNumber:
      invoiceModel.invoiceNumber,

    status:
      invoiceModel.status,

    issuedAt:
      invoiceModel.issuedAt,

    items:
      invoice.items.map(
        item => item.toJSON()
      ),
  });
}

  // =====================================================
  // FIND BY ID
  // =====================================================

  async findById(
    id: number,
    transaction?: Transaction
  ): Promise<InvoiceDomain | null> {

    const invoice = await Invoice.findByPk(
      id,
      {
        include: [
          {
            model: InvoiceItem,
            as: "items",
          },
        ],
        transaction,
      }
    );

    if (!invoice) {
      return null;
    }

    return this.toDomain(invoice);
  }


  // =====================================================
  // FIND BY ORDER ID
  // =====================================================

  async findByOrderId(
    orderId: number,
    transaction?: Transaction
  ): Promise<InvoiceDomain | null> {

    const invoice = await Invoice.findOne({
      where: {
        orderId,
      },

      include: [
        {
          model: InvoiceItem,
          as: "items",
        },
      ],

      transaction,
    });

    if (!invoice) {
      return null;
    }

    return this.toDomain(invoice);
  }


  // =====================================================
  // FIND BY INVOICE NUMBER
  // =====================================================

  async findByInvoiceNumber(
    invoiceNumber: string,
    transaction?: Transaction
  ): Promise<InvoiceDomain | null> {

    const invoice = await Invoice.findOne({
      where: {
        invoiceNumber,
      },

      include: [
        {
          model: InvoiceItem,
          as: "items",
        },
      ],

      transaction,
    });

    if (!invoice) {
      return null;
    }

    return this.toDomain(invoice);
  }


  // =====================================================
  // UPDATE
  // =====================================================

  async update(
    invoice: InvoiceDomain,
    transaction?: Transaction
  ): Promise<InvoiceDomain> {

    if (!invoice.id) {
      throw new Error(
        "Cannot update invoice without id"
      );
    }

    const invoiceModel = await Invoice.findByPk(
      invoice.id,
      {
        transaction,
      }
    );

    if (!invoiceModel) {
      throw new Error(
        `Invoice ${invoice.id} not found`
      );
    }

    await invoiceModel.update(
      {
        orderId: invoice.orderId,
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        issuedAt: invoice.issuedAt,
      },
      {
        transaction,
      }
    );

    return this.toDomain(invoiceModel);
  }


  // =====================================================
  // CANCEL
  // =====================================================

  async cancel(
    invoiceId: number,
    transaction?: Transaction
  ): Promise<void> {

    const invoice = await Invoice.findByPk(
      invoiceId,
      {
        transaction,
      }
    );

    if (!invoice) {
      throw new Error(
        `Invoice ${invoiceId} not found`
      );
    }

    await invoice.update(
      {
        status: "CANCELLED",
      },
      {
        transaction,
      }
    );
  }


  // =====================================================
  // MODEL → DOMAIN
  // =====================================================

  private toDomain(
    invoice: Invoice
  ): InvoiceDomain {

    const items =
      (invoice as any).items ?? [];

    return new InvoiceDomain({
      id: invoice.id,

      orderId: invoice.orderId,

      invoiceNumber:
        invoice.invoiceNumber,

      status:
        invoice.status,

      issuedAt:
        invoice.issuedAt,

      items: items.map(
        (item: any) => ({
          id: item.id,

          productId:
            item.productId,

          variantId:
            item.variantId,

          productName:
            item.productName,

          sku:
            item.sku,

          quantity:
            item.quantity,

          unitPrice:
            Number(item.unitPrice),

          discountAmount:
            Number(item.discountAmount),

          taxAmount:
            Number(item.taxAmount),

          totalAmount:
            Number(item.totalAmount),
        })
      ),
    });
  }
}