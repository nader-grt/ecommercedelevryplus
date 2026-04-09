

export default abstract class IVariantProductRepo
{

     protected abstract addVariantIfExistInProducts(data?: any):Promise<any> ;
     protected abstract getVariantById(variantId:number):Promise<any>;
    protected abstract listVariantsWithProduct({ search, page, perPage }: any):Promise<any> ;
  protected abstract  findBySku(sku: string): Promise<any> ;
  protected abstract convertProductToVariable(productId: number): Promise<any> ;
}