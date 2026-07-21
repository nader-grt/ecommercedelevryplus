import OrderDomain from "../../models/domain/OrderDomain/OrderDomain";
import { userRepo } from "../../repo/auth/userRepo/userRepo";
import OrderRepo from "../../repo/OrderRepo/OrderRepo";
import ProductRepo from "../../repo/productRepo/productRepo";
import GetCompanyOwnersUseCase from "../companyUseCase/GetCompanyOwnersUseCase";

interface OrderItemDTO {
  productId: number;
  quantity: number;
  variantId?: number;
}

interface CreateOrderDTO {
  custmerId: number;
  items: OrderItemDTO[];
  actor: {
    ownerId: number;
    ownerRole: string;
    ownerEmail?: string;
  };
}

export default class CreateOrderByAdminUseCase {
  private _userRepo!: userRepo;
  private _orderRepo!: OrderRepo;
  private _productRepo!: ProductRepo;
  private _userOwnerCompany: GetCompanyOwnersUseCase =
    new GetCompanyOwnersUseCase(new userRepo());
  constructor(
    userrepo: userRepo,
    orderRepo: OrderRepo,
    productRepo: ProductRepo,
    userOwnerCompany: GetCompanyOwnersUseCase
  ) {
    this._orderRepo = orderRepo;
    this._userRepo = userrepo;
    this._productRepo = productRepo;
    this._userOwnerCompany = userOwnerCompany;
  }

  async execute(dto: CreateOrderDTO): Promise<any> {
    try {
      const user = await this._userRepo.FindUserById(dto.custmerId);

      console.log(" user now  ", user);
      if (!user) {
        return { success: false, message: "user not found " };
      }
      const ownerCompany: any = await this._userOwnerCompany.execute();

      const companyId = ownerCompany[0].company.id;

      const productIds = dto.items.map((i) => i["productId"]);

      console.log("productsidss is \t ", productIds);

      const productsWithVariantIds =
        await this._productRepo.getProductsMapWithVariantsByIds(productIds);

      for (const [id, product] of productsWithVariantIds) {
        console.log("Product ID:", id);
        console.dir(product, { depth: null });
      }

      const order = new OrderDomain(dto.custmerId, companyId);

      for (const item of dto.items) {
        const productMapVariant = productsWithVariantIds.get(item["productId"]);

     //   const productMapVariant = productsWithVariantIds.get(item.productId);

        if (!productMapVariant) {
            throw new Error(`Product ${item.productId} not found`);
        }
        
        let variant;
        
        if (item.variantId) {
            variant = productMapVariant.variants.find(
                (v: any) => v.id === item.variantId
            );
        
            if (!variant) {
                throw new Error(
                    `Variant ${item.variantId} not found for product ${item.productId}`
                );
            }
        } else {
            // إذا لم يرسل الـ Frontend variantId
            if (productMapVariant.variants.length === 1) {
                variant = productMapVariant.variants[0];
            } else {
                throw new Error(
                    `Product ${item.productId} has multiple variants. variantId is required.`
                );
            }
        }
        
        order.addItem(
            productMapVariant.id,
            productMapVariant.name,
            item.quantity,
            Number(variant.price),
            variant.id
        );

        // console.log("productMapVariant is \t ", productMapVariant);

        // if (!productMapVariant) {
        //   throw new Error(`Product ${item.productId} not found`);
        // }

        // if (productMapVariant.companyId !== companyId) {
        //   throw new Error("Products must belong to same company");
        // }

        // if (productMapVariant.companyId !== companyId) {
        //   throw new Error("Products must belong to the same company");
        // }
  

        // if (!item.variantId) {
        //   throw new Error(`Variant required for product ${item.productId}`);
        // }

        // const variant = productMapVariant.variants.find(
        //   (v: any) => v.id === item.variantId
        // );
        // if (!variant) {
        //   throw new Error(`Variant ${item.variantId} not found`);
        // }
        // // order.addItem(productMapVariant.id, productMapVariant.name, item["quantity"], productMapVariant?.price);

        // order.addItem(
        //   productMapVariant.id,
        //   productMapVariant.name,
        //   item.quantity,
        //   Number(variant.price),
        //   variant.id
        // );
      }

      const totalAmount = order.getTotalAmount();
      //   console.log(totalAmount);

      console.log("orderrrrrrrrrrrr  ", order);
      await this._orderRepo.CreateOrderByAdmin(order);
      return { success: true, message: "okkkkkkkk" };
    } catch (error) {
      console.log(error);
    }
  }
}
