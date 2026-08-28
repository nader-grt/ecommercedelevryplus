import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import { RequestAuth } from "../../middleware/verifyToken";
import CreateOrderByAdminUseCase from "../../useCases/OrderUsecase/CreateOrderByAdminUseCase";

export  default class CreateOrderByAdminController  extends BaseController
{

           private _createOrderByAdminUseCase!:CreateOrderByAdminUseCase
          constructor(createOrderByAdminUseCase:CreateOrderByAdminUseCase)
          {super()
           this._createOrderByAdminUseCase = createOrderByAdminUseCase
          }
     protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
         
                const  { id}  =  req.params  ;  
                 const {items}  =  req.body
                 const user :any = req.user
                const userId  =  Number(id)



                   console.log("admin ",items , userId)

                   const actor = {
                     ownerId: req.user!.id,
                     ownerRole: req.user!.role
                };

                const customerId = req.params.id
                     ? userId
                     : actor.ownerId;
                 try {

                  console.log("##########  is \t ",customerId ,"\t actor is \t ",actor )
                  const dto = {
                     customerId:Number(customerId),
                     items,
                     actor
                }

                console.log("dto  order  where put companyId ",user)
             //   await this._createOrderByAdminUseCase.execute(dto)

             /**
                customerId: number;

  items: OrderItemDTO[];

  actor: {
    ownerId: number;
    ownerRole: string;
    ownerEmail?: string;
  };
              */
             console.log("dto is \t  ",dto )
                    const result =        await this._createOrderByAdminUseCase.execute(dto)

                    console.log("resultttttttt  orderrrrrrrr is  ",result)
                    if(!result.success)
                    {
                       return this.fail(res,result.message)
                    }

                    return this.ok(res,result)

              //    return this.ok(res,"message ok")
                 } catch (error) {
                    console.log(error)
                 }
     }
}