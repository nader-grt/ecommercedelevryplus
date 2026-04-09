import { Product } from "../../models/main";
import VariantProductRepo from "../../repo/VariantProductRepo/VariantProductRepo";

export default class ConvertProductToVariableUseCase {



  private _variantRepo: VariantProductRepo;

  constructor( variantRepo: VariantProductRepo) {
    
    this._variantRepo = variantRepo;
  }
    async execute(productId: number) {




      // convert automatically
  const result =   await  this._variantRepo .convertProductToVariable(productId);
      
      return {
        message: "Product converted to VARIABLE",
        data: "product",
      };
    }
  }