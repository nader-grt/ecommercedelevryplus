import { DeleteVariantResult } from "./VariantProductRepo";


export default abstract class IVariantProductRepo
{

     protected abstract addVariantIfExistInProducts(data?: any):Promise<any> ;
     protected abstract getVariantById(variantId:number):Promise<any>;
     protected abstract getVariantById2(variantId:number):Promise<any>;
    protected abstract listVariantsWithProduct({ search, page, perPage }: any):Promise<any> ;
  protected abstract  findBySku(sku: string): Promise<any> ;
  protected abstract convertProductToVariable(productId: number): Promise<any> ;
  protected abstract   deleteVariant(id: number): Promise<DeleteVariantResult> ;
  protected abstract   updateVariant(id: number, data: any): Promise<any> ;
  protected abstract countByProduct(productId: number): Promise<number>  ;
  protected abstract findDuplicateCombination( productId: number,color: string,size: string, excludeId?: number ): Promise<any> ;
  protected abstract convertProductToSimple(productId: number): Promise<any>  ;
  protected abstract isVariantUsed(variantId: number): Promise<boolean> 
  protected abstract countOrders(id: number, t?: any): Promise<number> ;
  protected abstract countInventory(id: number, t?: any): Promise<number>;
  protected abstract softDeleteVariant(id: number, t?: any): Promise<void>
}