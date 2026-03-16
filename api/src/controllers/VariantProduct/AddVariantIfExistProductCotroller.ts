import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import AddVariantIfExistProductUseCase from "../../useCases/VariantProductUseCase/AddVariantIfExistProductUseCase";


export default class AddVariantIfExistProductCotroller extends BaseController
{

    private _addVariantIfExistProductUseCase!:AddVariantIfExistProductUseCase
    constructor(addVariantIfExistProductUseCase:AddVariantIfExistProductUseCase)
    {super()

        this._addVariantIfExistProductUseCase = addVariantIfExistProductUseCase
    }
     protected async executeImpl(req: Request, res: Response): Promise<any> {
         
                   try {
                    
                   } catch (error) {
                    
                   }
     }
}