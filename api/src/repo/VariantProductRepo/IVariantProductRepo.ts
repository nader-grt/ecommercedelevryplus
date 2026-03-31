

export default abstract class IVariantProductRepo
{

     protected abstract addVariantIfExistInProducts():Promise<any> ;
     protected abstract getVariantById(variantId:number):Promise<any>;
    protected abstract listVariantsWithProduct({ search, page, perPage }: any):Promise<any> ;

}