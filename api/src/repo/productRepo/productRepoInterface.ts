


export default abstract class productRepoInterface
{

       protected abstract FindAllProducts():Promise<void> ;
       protected abstract GetProductById(id:number):Promise<void> ;
       protected abstract DeleteProductById(id:number):Promise<void> ;
       protected abstract createProduct(product:any,categoryId:number,supplierId:number | null):Promise<void> ;
       protected abstract getRandomProductsCached(limitaccepted:number):Promise<any> ;
    
       protected abstract getProductByCategoryId(categoryId:number):Promise<any> ;
       protected abstract getProductsByCategoryWithVariants(categoryId:number):Promise<any> ;

  protected abstract getAllProductsFiltred(cleanQuery:any,notFiltred:any):Promise<any>;
      //  static  IsExistProduct():Promise<void> ;
      protected abstract createProductWithVariants(products:any,variants:any):Promise<any>;
      protected abstract GetProductWithVariantsById(id:number):Promise<void> ;
      protected abstract getAllProductVariantsFiltred(cleanQuery:any,notFiltred:any):Promise<any>;
      protected abstract createProductWithVariants2(products:any,variants:any):Promise<any>;
      protected abstract  updateProductWithVariants(
        productId: number,
        productData: any,
        variants?: any[]
      ): Promise<any>
}