import ProductRepo from "../../repo/productRepo/productRepo";

export default class DeleteProductWithVariantUseCase {
  
   private _repo!: ProductRepo
   constructor(repo :ProductRepo) {
      this._repo = repo
   }
 
   async execute(productId?: number): Promise<any> {
     try {
       // =========================
       // 🔹 VALIDATION
       // =========================
       if (!productId) {
         throw new Error("Product id is required");
       }
 
       // =========================
       // 🔹 CHECK EXISTENCE
       // =========================
       const product = await this._repo.findById(productId);
 
       if (!product) {
         throw new Error("Product not found");
       }
 
       // =========================
       // 🔹 CHECK ORDERS
       // =========================
       const hasOrders = await this._repo.hasOrders(productId);
 
       // =========================
       // 🔥 SOFT DELETE CASE
       // =========================
       if (hasOrders) {
         await this._repo.softDeleteWithVariants(productId);
 
         return {
           success: true,
           type: "SOFT_DELETE",
           message: "Product archived (used in orders)",
         };
       }
 
       // =========================
       // 🔥 HARD DELETE CASE
       // =========================
      await this._repo.DeleteProductWithVariant(productId);
 
       return {
         success: true,
         type: "HARD_DELETE",
         message: "Product deleted permanently",
       };
 
     } catch (error: any) {
       return {
         success: false,
         message: error.message,
       };
     }
   }
 }