export default abstract class IVariantPriceTierRepo {
  
    abstract create(data: {
      variantId: number;
      minQty: number;
      price: number;
    }): Promise<any>;
  
    abstract findByVariantId(variantId: number): Promise<any[]>;
  
    abstract findByVariantIdDesc(variantId: number): Promise<any[]>;
  
    abstract findById(id: number): Promise<any>;
  
    abstract findDuplicate(variantId: number, minQty: number): Promise<any>;
  
    abstract update(id: number, data: any): Promise<any>;
  
    abstract delete(id: number): Promise<any>;
  
    abstract findAll(): Promise<any[]>;
  }