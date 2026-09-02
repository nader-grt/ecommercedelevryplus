import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";

import InventoryMovementRepo from "../../repo/MovementRepo/InventoryMovementRepo";

import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";

import InventorieDomain from "../../models/domain/InventorieDomain/InventorieDomain";

import { InventoryPolicy } from "../../Policy/InventoryPolicy";

import sequelize from "../../dbConfig/config";

import { IWareHouseRepo } from "../../repo/WareHouseRepo/IWareHouseRepo";



export default class AddStockInventorieUseCase {

  private _variantProductRepo: VariantProductRepo;

  private _InventorieRepo: InventorieRepo;

  private _inventoryMovement: InventoryMovementRepo;

  private _WareHouseRepo: IWareHouseRepo;

  constructor(
    inventorieRepo: InventorieRepo,
    variantProductRepo: VariantProductRepo,
    inventoryMovement: InventoryMovementRepo,
    wareHouse: IWareHouseRepo
  ) {

    this._InventorieRepo = inventorieRepo;

    this._variantProductRepo = variantProductRepo;

    this._inventoryMovement = inventoryMovement;

    this._WareHouseRepo = wareHouse;
  }

  async execute(dto: any, user: any): Promise<any> {

    const { variantId, warehouseId, quantity } = dto;

    console.log("addStock dto ", dto);

    console.log("usecase addStockUseCase  ");

    if (!variantId || !warehouseId) {

      throw new Error("variantId and warehouseId are required");

    }

    console.log(
      "USECASE NEW IS \T",
      { variantId, warehouseId, quantity }
    );

    if (
      typeof quantity !== "number" ||
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {

      throw new Error("Invalid quantity");

    }

    const variant =
      await this._variantProductRepo.getVariantById(variantId);

    console.log(
      "vvvvvv  variant is ",
      variant,
      "afterrrrrrrrr  "
    );

    if (!variant) {
      throw new Error("Variant not found");
    }

    const companyId: number | any =
      variant.product?.companyId;

    if (!companyId) {
      throw new Error(
        "Product is missing company association"
      );
    }

    const warehouse =
      await this._WareHouseRepo.getById(warehouseId);

    if (
      !warehouse ||
      warehouse.companyId !== companyId
    ) {

      throw new Error(
        "Warehouse does not belong to this company"
      );

    }

    console.log(
      "#####################  1 \n\n "
    );

    // InventoryPolicy.canAccess(user, variant.companyId);

    console.log(
      "#####################  2 \n\n\n "
    );

    console.log(
      "variant.companyId:",
      variant.companyId
    );

    console.log(
      "variant.product?.companyId:",
      variant?.product?.companyId
    );

    console.log(
      "local companyId:",
      companyId
    );

    // FIXED:
    // Do not pass variant.companyId because it is undefined.
    // Pass the companyId extracted from variant.product.companyId.

    return this._executeWithRetry(
      variantId,
      warehouseId,
      companyId,
      quantity,
      user
    );
  }

  private async _executeWithRetry(

    variantId: string,
    warehouseId: string,
    companyId: string,

    quantity: number,
    user: any,
    attempt = 0

  ): Promise<any> {

    try {

      return await sequelize.transaction(
        async (transaction: any) => {

          console.log(
            "companyId is \t   ",
            companyId
          );

          let inventory =
            await this._InventorieRepo
              .findByVariantAndWarehouse(

                +variantId,
                +warehouseId,
                +companyId,
                transaction

              );

          console.log(
            "inventory  inventory  is  ",
            inventory
          );

          if (!inventory) {

            inventory =
              await this._InventorieRepo.create(

                {
                  variantId,
                  warehouseId,
                  companyId,
                  quantity: 0,
                  reserved: 0
                },

                transaction

              );

          }

          console.log(
            "fin 1  ",
            inventory,
            quantity,
            user
          );

          let stockResult: any =
            await this._applyStock(

              inventory,
              quantity,
              user,
              transaction

            );

          console.log(
            "stockResult stockResult stockResult  ",
            stockResult
          );

          return await this._applyStock(
            inventory,
            quantity,
            user,
            transaction
          );

        }
      );

    } catch (error: any) {

      if (
        error.name ===
        "SequelizeUniqueConstraintError"
      ) {

        if (attempt < 3) {

          return this._executeWithRetry(
            variantId,
            warehouseId,
            companyId,
            quantity,
            user,
            attempt + 1
          );

        }

        throw new Error(
          "Could not update inventory, please try again"
        );

      }

      throw error;

    }

  }

  private async _applyStock(

    inventory: any,

    quantity: number,

    user: any,

    transaction: any

  ): Promise<any> {

    console.log(
      "############ hiaaaaaaaaaaaaaaa  ####################"
    );

    const domain = new InventorieDomain({

      id: inventory.id,

      variantId: inventory.variantId,

      warehouseId: inventory.warehouseId,

      companyId: inventory.companyId,

      quantity: inventory.quantity,

      reserved: inventory.reserved,

    });

    console.log(
      "ddddddd inside function applystock ",
      domain
    );

    domain.addStock(quantity, user.id);

    // update inventory quantity

    await this._InventorieRepo.update(

      inventory.id,

      {

        quantity: domain.quantity,

        reserved: domain.reserved,

      },

      transaction

    );

    // save inventory movements

    const movements = domain.pullMovements();

    console.log(

      "movements resulttttttttt fin result movements is ",

      movements

    );

    let data2: any;

    if (movements.length > 0) {

      const movementData =
        movements.map((m: any) => ({

          variantId: m._variantId,

          warehouseId: m._warehouseId,

          type: m._type,

          quantity: m._quantity,

          userId: m._userId,

          note: m._note,

        }));

      console.log(

        "movementData before insert ",

        movementData

      );

      data2 =
        await this._inventoryMovement.bulkCreate(

          movementData,

          transaction

        );

      console.log(
        "ddddddddddd ffffff d22222222222   ",
        data2[0]
      );

    }

    const data: any = domain;

    const result = {

      message: "Stock added successfully",

      data: data,

    };

    console.log(

      "FINAL STOCK RESULT ",

      result

    );

    return result;

  }

}


























// import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
// import InventoryMovementRepo from "../../repo/MovementRepo/InventoryMovementRepo";
// import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";
// import InventorieDomain from "../../models/domain/InventorieDomain/InventorieDomain";
// import { InventoryPolicy } from "../../Policy/InventoryPolicy";
// import sequelize from "../../dbConfig/config";
// import { IWareHouseRepo } from "../../repo/WareHouseRepo/IWareHouseRepo";
// import { Console } from "console";
// import { number } from "joi";

// export default class AddStockInventorieUseCase {
//   private _variantProductRepo: VariantProductRepo;
//   private _InventorieRepo: InventorieRepo;
//   private _inventoryMovement: InventoryMovementRepo;
//   private _WareHouseRepo:IWareHouseRepo

//   constructor(
//     inventorieRepo: InventorieRepo,
//     variantProductRepo: VariantProductRepo,
//     inventoryMovement: InventoryMovementRepo,
//     wareHouse:IWareHouseRepo

//   ) {
//     this._InventorieRepo = inventorieRepo;
//     this._variantProductRepo = variantProductRepo;
//     this._inventoryMovement = inventoryMovement;
//     this._WareHouseRepo = wareHouse
//   }

//   async execute(dto: any, user: any): Promise<any> {
//     const { variantId, warehouseId, quantity } = dto;

//     console.log("addStock dto ",dto)
//     console.log("usecase addStockUseCase  ")
  
//     if (!variantId || !warehouseId) {
//       throw new Error("variantId and warehouseId are required");
//     }

//     console.log("USECASE NEW IS \T", { variantId, warehouseId, quantity })
//     if (typeof quantity !== "number" || !Number.isFinite(quantity) || quantity <= 0) {
//       throw new Error("Invalid quantity");
//     }
  
// //   

//  console.log("vvvvvv  variant is 111111111111 " )
//  const variant = await this._variantProductRepo.getVariantById(variantId);
// // const variant2 = await this._variantProductRepo.getVariantById(variantId);
//  console.log("vvvvvv  variant is  " , variant, "afterrrrrrrrr  ")

  




// if (!variant) throw new Error("Variant not found");

// const companyId :number | any = variant.product?.companyId; // variant.companyId
// if (!companyId) throw new Error("Product is missing company association");

// const warehouse = await this._WareHouseRepo.getById(warehouseId);
// if (!warehouse || warehouse.companyId !== companyId) {
//   throw new Error("Warehouse does not belong to this company");
// }

//     console.log("#####################  1 \n\n ")
  
//   //  InventoryPolicy.canAccess(user, variant.companyId);
//   console.log("#####################  2 \n\n\n ")


//   console.log("variant.companyId:", variant.companyId);
//   console.log("variant.product?.companyId:", variant?.product?.companyId);
//   console.log("local companyId:", companyId)
//     return   this._executeWithRetry(variantId, warehouseId, variant.companyId, quantity, user);
//   }

//   private async _executeWithRetry(
//     variantId: string, warehouseId: string, companyId: string,
//     quantity: number, user: any, attempt = 0
//   ): Promise<any> {

   
//     try {
//       return await sequelize.transaction(async (transaction: any) => {
//         console.log("companyId is \t   ",companyId )
      
//         let inventory = await this._InventorieRepo.findByVariantAndWarehouse(
//           +variantId, +warehouseId,+companyId, transaction
//         );

//         console.log("inventory  inventory  is  ",inventory)  
//         if (!inventory) {
//           inventory = await this._InventorieRepo.create(
//             { variantId, warehouseId, companyId, quantity: 0, reserved: 0 },
//             transaction
//           );
//         }


//         console.log("fin 1  ",inventory, quantity, user)
//       //  console.log(" ***********  addStockUseCase  is  ",this._applyStock(inventory, quantity, user, transaction))
//       let stockResult:any = await this._applyStock(inventory, quantity, user, transaction);
//       console.log("stockResult stockResult stockResult  ",stockResult )
//         return   await this._applyStock(inventory, quantity, user, transaction); 
//       });
//     } catch (error: any) {
//       if (error.name === "SequelizeUniqueConstraintError") {
//         if (attempt < 3) {
//           return this._executeWithRetry(variantId, warehouseId, companyId, quantity, user, attempt + 1);
//         }
//         throw new Error("Could not update inventory, please try again");
//       }
//       throw error;
//     }
//   }


//   private async _applyStock(
//     inventory: any,
//     quantity: number,
//     user: any,
//     transaction: any
//   ): Promise<any> {
  
//     console.log("############ hiaaaaaaaaaaaaaaa  ####################");
  
//     const domain = new InventorieDomain({
//       id: inventory.id,
//       variantId: inventory.variantId,
//       warehouseId: inventory.warehouseId,
//       companyId: inventory.companyId,
//       quantity: inventory.quantity,
//       reserved: inventory.reserved,
//     });
  
//     console.log("ddddddd inside function applystock ", domain);
  
//     domain.addStock(quantity, user.id);
  
  
//     // update inventory quantity
//     await this._InventorieRepo.update(
//       inventory.id,
//       {
//         quantity: domain.quantity,
//         reserved: domain.reserved,
//       },
//       transaction
//     );
  
  
//     // save inventory movements
//     const movements = domain.pullMovements();
  
//     console.log(
//       "movements resulttttttttt fin result movements is ",
//       movements
//     );
  
//     let data2 :any
//     if (movements.length > 0) {
  
//       const movementData = movements.map((m: any) => ({
//         variantId: m._variantId,
//         warehouseId: m._warehouseId,
//         type: m._type,
//         quantity: m._quantity,
//         userId: m._userId,
//         note: m._note,
//       }));
  
//       console.log(
//         "movementData before insert ",
//         movementData
//       );
  
  
//        data2  =   await this._inventoryMovement.bulkCreate(
//         movementData,
//         transaction
//       );
//       console.log("ddddddddddd ffffff d22222222222   ",data2[0] )
//     }
  
  
//     const data :any = domain 

//     const result = {
//       message: "Stock added successfully",
//       data:data,
//     };
  
  
//     console.log(
//       "FINAL STOCK RESULT ",
//       result
//     );
  
  
//     return result;
//   }

//   // private async _applyStock(
//   //   inventory: any,
//   //   quantity: number,
//   //   user: any,
//   //   transaction: any
//   // ): Promise<any> {

//   //   console.log("############ hiaaaaaaaaaaaaaaa  ####################  ")
//   //   const domain = new InventorieDomain({
//   //     id: inventory.id,
//   //     variantId: inventory.variantId,
//   //     warehouseId: inventory.warehouseId,
//   //     companyId: inventory.companyId,
//   //     quantity: inventory.quantity,
//   //     reserved: inventory.reserved,
//   //   });

//   //   console.log("ddddddd  inside function applystock ",domain)
//   //   domain.addStock(quantity, user.id);

//   //   await this._InventorieRepo.update(
//   //     inventory.id,
//   //     { quantity: domain.quantity, reserved: domain.reserved },
//   //     transaction
//   //   );

//   //   const movements = domain.pullMovements();
//   //   console.log("movements resulttttttttt  fin result  movements is \t   ",movements)
//   //   // if (movements.length > 0) {
//   //   //   await this._inventoryMovement.bulkCreate(
//   //   //     movements.map((m: any) => m.data),
//   //   //     transaction
//   //   //   );
//   //   // }

//   //   if (movements.length > 0) {
//   //     console.log("block ifffffffffffffffffff  work \n\n\n\n ")
//   //   const result22 :any =   await this._inventoryMovement.bulkCreate(
//   //       movements.map((m: any) => ({
//   //         variantId: m.variantId,
//   //         warehouseId: m.warehouseId,
//   //         type: m.type,
//   //         quantity: m.quantity,
//   //         userId: m.userId,
//   //         note: m.note,
//   //       })),
//   //       transaction
//   //     );

//   //     console.log("result22  result22result22result22result22result22  ",result22)
//   //   }

//   //   console.log(domain.toJSON()  , "ggggggggggggggggfff ,domainnnnnnnnnnnnnnnn  ",domain )
//   //   return {
//   //     message: "Stock added successfully",
//   //     data: domain.toJSON(),
//   //   };
//   // }
// }

  