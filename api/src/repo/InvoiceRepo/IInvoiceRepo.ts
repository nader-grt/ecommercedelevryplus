import { Transaction } from "sequelize";
import InvoiceDomain from "../../models/domain/InvoiceDomain/InvoiceDomain";

export default interface IInvoiceRepo {
  create(
    invoice: InvoiceDomain,
    transaction?: Transaction
  ): Promise<InvoiceDomain>;

  findById(
    id: number,
    transaction?: Transaction
  ): Promise<InvoiceDomain | null>;

  findByOrderId(
    orderId: number,
    transaction?: Transaction
  ): Promise<InvoiceDomain | null>;

  findByInvoiceNumber(
    invoiceNumber: string,
    transaction?: Transaction
  ): Promise<InvoiceDomain | null>;

  update(
    invoice: InvoiceDomain,
    transaction?: Transaction
  ): Promise<InvoiceDomain>;

  cancel(
    invoiceId: number,
    transaction?: Transaction
  ): Promise<void>;
}