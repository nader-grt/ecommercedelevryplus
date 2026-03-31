import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";

export default class GetInventorieUseCase {
  private _variantProductRepo!: VariantProductRepo;
  private _InventorieRepo!: InventorieRepo;
  constructor(
    inventorieRepo: InventorieRepo,
    variantProductRepo: VariantProductRepo
  ) {
    this._InventorieRepo = inventorieRepo;
    this._variantProductRepo = variantProductRepo;
  }
  async execute(dto: any): Promise<any> {
    const { variantId, warehouseId ,inventoryId } = dto;

    console.log("dttttttttttttoooooooooo    ",dto)
    try {

        let inventoryFound;

        //  CASE 1: get by ID
        if (inventoryId) {
            inventoryFound = await this._InventorieRepo.findById(inventoryId);
    
          if (!inventoryFound) {
            throw new Error("Inventory not found");
          }
        }

        if (!variantId || !warehouseId) {
            throw new Error("variantId and warehouseId are required");
          }

                // 2. Check variant exists (optional but good practice)
          const variant = await this._variantProductRepo.getVariantById(variantId);
          if (!variant) {
            throw new Error("Variant not found");
          }
    
          // 3. Get inventory
          const inventory = await this._InventorieRepo.findByVariantAndWarehouse(
            variantId,
            warehouseId
          );
          
          console.log("inventory aaaaaaa ",inventory)
          if (!inventory) {
            throw new Error("Inventory not found for this variant & warehouse");
          }
    
          // 4. Add computed field (best practice)
          const result = {
            ...inventory.toJSON(),
            available: inventory.quantity - inventory.reserved,
          };
    
          return result;
      

  

  
    } catch (error: any) {
   

      throw error;
    }
  }
}
