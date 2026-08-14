import { Sequelize, Transaction } from "sequelize";

import OrderDomain from "../../models/domain/OrderDomain/OrderDomain";

import { userRepo } from "../../repo/auth/userRepo/userRepo";
import OrderRepo from "../../repo/OrderRepo/OrderRepo";
import ProductRepo from "../../repo/productRepo/productRepo";

import GetCompanyOwnersUseCase from "../companyUseCase/GetCompanyOwnersUseCase";
import ReserveStockUseCase from "../InventorieUseCase/ReserveStockUseCase";
import GenerateInvoiceUseCase from "../InvoiceUseCase/GenerateInvoiceUseCase";

// ======================================================
// DTO
// ======================================================

export interface OrderItemDTO {
  productId: number;
  quantity: number;
  variantId?: number;
}

export interface CreateOrderDTO {
  customerId: number;

  items: OrderItemDTO[];

  actor: {
    ownerId: number;
    ownerRole: string;
    ownerEmail?: string;
  };
}

// ======================================================
// Result
// ======================================================

export interface CreateOrderResult {
  success: boolean;
  message: string;

  orderId?: number;

  invoiceId?: number;

  invoiceNumber?: string;
}

// ======================================================
// Product / Variant Types
// ======================================================

interface VariantData {
  id: number;
  price: number | string;
  sku?: string;
}

interface ProductData {
  id: number;
  name: string;
  companyId: number;
  variants: VariantData[];
}

// ======================================================
// Internal shape kept from the validation loop,
// reused later to build the Invoice payload
// (avoids re-reading OrderDomain internals)
// ======================================================

interface ResolvedOrderItem {
  productId: number;
  productName: string;
  variantId: number;
  sku?: string;
  quantity: number;
  unitPrice: number;
}

// ======================================================
// CreateOrderByAdminUseCase
// ======================================================
//
// IMPORTANT — architecture note:
//
// ReserveStockUseCase manages its OWN transaction
// internally (with retry/backoff) and does not accept
// an external transaction. GenerateInvoiceUseCase DOES
// accept an external transaction.
//
// Consequence: this Use Case can NOT wrap
// Order + ReserveStock + Invoice in a single ACID
// transaction. It is a SAGA: each step commits on its
// own, and if a later step fails, we run a
// compensating action instead of a DB rollback.
//
// Flow:
//   1) Create Order + OrderItems      -> COMMIT (T1)
//   2) Reserve Stock (its own T2)     -> if it fails,
//        compensate by cancelling the Order
//   3) Generate Invoice               -> COMMIT (T3)
//        if it fails, stock is already reserved and
//        MUST be released by a compensating step
//        (ReleaseStockUseCase — not implemented yet,
//        see TODO below)
// ======================================================

export default class CreateOrderByAdminUseCase {

  constructor(
    private readonly _userRepo: userRepo,
    private readonly _orderRepo: OrderRepo,
    private readonly _productRepo: ProductRepo,
    private readonly _getCompanyOwnersUseCase: GetCompanyOwnersUseCase,
    private readonly _reserveStockUseCase: ReserveStockUseCase,
    private readonly _generateInvoiceUseCase: GenerateInvoiceUseCase,
    private readonly _sequelize: Sequelize
  ) {}

  // ====================================================
  // EXECUTE
  // ====================================================

  async execute(dto: CreateOrderDTO): Promise<CreateOrderResult> {

    // 1. Validate Request
    this.validateRequest(dto);

    // 2. Validate Actor
    await this.validateActor(dto.actor);

    // 3. Validate Customer
    const customer = await this._userRepo.FindUserById(dto.customerId);
    if (!customer) {
      throw new Error(`Customer ${dto.customerId} not found`);
    }

    // 4. Resolve Company
    const companyId = await this.resolveCompany();

    // 5. Load Products + Variants (batched)
    const productIds = dto.items.map((item) => item.productId);
    const products = await this._productRepo.getProductsMapWithVariantsByIds(
      productIds
    );

    // 6. Build Order Domain + collect resolved items
    //    (resolved items are reused later for the invoice payload)
    const order = new OrderDomain(dto.customerId, companyId);
    const resolvedItems: ResolvedOrderItem[] = [];

    for (const item of dto.items) {
      const product = products.get(item.productId) as
        | ProductData
        | undefined;

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (product.companyId !== companyId) {
        throw new Error(
          `Product ${item.productId} does not belong to company ${companyId}`
        );
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error(`Invalid quantity for product ${item.productId}`);
      }

      const variant = this.resolveVariant(product, item);

      const price = Number(variant.price);
      if (!Number.isFinite(price) || price < 0) {
        throw new Error(`Invalid price for variant ${variant.id}`);
      }

      order.addItem(product.id, product.name, item.quantity, price, variant.id);

      resolvedItems.push({
        productId: product.id,
        productName: product.name,
        variantId: variant.id,
        sku: variant.sku,
        quantity: item.quantity,
        unitPrice: price,
      });
    }

    // 7. Validate Order Total
    const totalAmount = order.getTotalAmount();
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      throw new Error("Order total must be greater than zero");
    }

    // ==================================================
    // STEP A — Create Order + OrderItems (T1, committed)
    // ==================================================

    const createOrderTx: Transaction = await this._sequelize.transaction();

    let createdOrder: any;

    try {
      createdOrder = await this._orderRepo.CreateOrderByAdmin(
        order,
        createOrderTx
      );

      if (!createdOrder || !createdOrder.id) {
        throw new Error("Failed to create order");
      }

      await createOrderTx.commit();
    } catch (error) {
      await createOrderTx.rollback();
      throw error;
    }

    // ==================================================
    // STEP B — Reserve Stock
    //
    // ReserveStockUseCase runs its own transaction.
    // If it fails, the Order already exists and was
    // already committed in STEP A, so we must
    // COMPENSATE by cancelling it instead of relying
    // on a rollback.
    // ==================================================

    try {
      await this._reserveStockUseCase.execute({
        orderId: createdOrder.id,
        userId: dto.actor.ownerId,
        companyId,
      });
    } catch (error) {
      await this.compensateFailedReservation(createdOrder.id);
      throw error;
    }

    // ==================================================
    // STEP C — Generate Invoice (T3, committed)
    //
    // GenerateInvoiceUseCase DOES accept an external
    // transaction, so Invoice + InvoiceItems +
    // Order status update are atomic together.
    //
    // If this fails, stock is ALREADY reserved (STEP B
    // already committed). This must be compensated by
    // releasing the reservation.
    //
    // TODO: implement ReleaseStockUseCase and call it
    // in the catch block below once available.
    // ==================================================

    const invoiceTx: Transaction = await this._sequelize.transaction();

    try {
      const invoice = await this._generateInvoiceUseCase.execute({
        orderId: createdOrder.id,
        items: resolvedItems.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          productName: i.productName,
          sku: i.sku ?? null,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
        transaction: invoiceTx,
      });

      await this._orderRepo.updateStatus(
        createdOrder.id,
        "PENDING_PAYMENT",
        invoiceTx
      );

      await invoiceTx.commit();

      return {
        success: true,
        message: "Order created successfully",
        orderId: createdOrder.id,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
      };
    } catch (error) {
      await invoiceTx.rollback();

      // TODO: await this._releaseStockUseCase.execute({ orderId: createdOrder.id });
      console.error(
        `[CreateOrderByAdmin] CRITICAL: stock reserved for order ${createdOrder.id} but invoice failed. Manual review / release required.`,
        error
      );

      throw error;
    }
  }

  // ====================================================
  // Compensation: reservation failed after order created
  // ====================================================

  private async compensateFailedReservation(orderId: number): Promise<void> {
    try {
      await this._orderRepo.updateStatus(orderId, "CANCELLED");
    } catch (compensationError) {
      console.error(
        `[CreateOrderByAdmin] CRITICAL: failed to cancel order ${orderId} after reservation failure.`,
        compensationError
      );
    }
  }

  // ====================================================
  // Validate Request
  // ====================================================

  private validateRequest(dto: CreateOrderDTO): void {
    if (!dto) {
      throw new Error("Request body is required");
    }

    if (!Number.isInteger(dto.customerId) || dto.customerId <= 0) {
      throw new Error("Valid customerId is required");
    }

    if (!Array.isArray(dto.items) || dto.items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    if (!dto.actor) {
      throw new Error("Actor is required");
    }

    if (!Number.isInteger(dto.actor.ownerId) || dto.actor.ownerId <= 0) {
      throw new Error("Valid actor ownerId is required");
    }

    if (!dto.actor.ownerRole) {
      throw new Error("Actor role is required");
    }
  }

  // ====================================================
  // Validate Actor
  // ====================================================

  private async validateActor(actor: CreateOrderDTO["actor"]): Promise<void> {
    const user = await this._userRepo.FindUserById(actor.ownerId);

    if (!user) {
      throw new Error(`Actor ${actor.ownerId} not found`);
    }

    const allowedRoles = ["ADMIN", "OWNER", "EMPLOYEE"];

    if (!allowedRoles.includes(actor.ownerRole)) {
      throw new Error(`Role ${actor.ownerRole} cannot create orders`);
    }
  }

  // ====================================================
  // Resolve Company
  // ====================================================

  private async resolveCompany(): Promise<number> {
    const owners = await this._getCompanyOwnersUseCase.execute();

    if (!owners || owners.length === 0) {
      throw new Error("Company not found for current owner");
    }

    const company = owners[0]?.company;

    if (!company?.id) {
      throw new Error("Company ID not found");
    }

    return company.id;
  }

  // ====================================================
  // Resolve Variant
  // ====================================================

  private resolveVariant(product: ProductData, item: OrderItemDTO): VariantData {
    if (!product.variants || product.variants.length === 0) {
      throw new Error(`Product ${product.id} has no variants`);
    }

    if (item.variantId !== undefined && item.variantId !== null) {
      const variant = product.variants.find((v) => v.id === item.variantId);

      if (!variant) {
        throw new Error(
          `Variant ${item.variantId} not found for product ${product.id}`
        );
      }

      return variant;
    }

    if (product.variants.length === 1) {
      return product.variants[0];
    }

    throw new Error(
      `Product ${product.id} has multiple variants. variantId is required.`
    );
  }
}