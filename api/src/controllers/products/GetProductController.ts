import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import ProductDomain from "../../models/domain/productDoman/ProductDomain";
import ProductRepo from "../../repo/productRepo/productRepo";
import GetProductUseCase from "../../useCases/productUseCase/GetProductUseCase";
import { BASE_URL } from "../../dbConfig/configApp";



export default class  GetProductController extends BaseController
{
            

         private _getProductUseCase!:GetProductUseCase
          constructor(getProductUseCase:GetProductUseCase)
          {super()
             this._getProductUseCase = getProductUseCase ;
               

          }


          protected async executeImpl(req: Request, res: Response): Promise<any> {
               
                       const { productid}  = req.params ;
                       const productId :number = Number(productid)


                       console.log("step 2 " ,productId)
                            try {
                          // const result =          await  this._getProductUseCase.execute(productId)
                           const result =          await  this._getProductUseCase.execute(productId)

                           console.log("rrrrrrrr result  ",result)

          if(!result.success)
          {
             return this.fail(res,result.message)
          }

          console.log("result product ********",result.product )
            //       const productData = {
            //         nameProduct:result.product.name ,
            //  priceProduct : result.product.price ,
            //  urlImage : `${BASE_URL}/images/${result.product.nameImage}`
            //       }

                  const productData = {
                     id: result.id,
                     nameProduct: result.product.name,
                     type: result.product.type,
                     priceProduct: result.product.price,
                     urlImage: `${BASE_URL}/images/${result.product.nameImage}`,
                     variants: result.product.variants || [],
                   };

      

                                   return this.resultValue(res," item product   ",productData)
                            } catch (error) {
                                console.log(error)
                            }
          }
}