













import { Response } from "express";

import { BaseController } from "../../infra/BaseCOntroller";

import ReserveStockUseCase from "../../useCases/InventorieUseCase/ReserveStockUseCase";

import { RequestAuth } from "../../middleware/verifyToken";


// ======================================================
// RESERVE STOCK CONTROLLER
// ======================================================

export default class ReserveStockController extends BaseController {

    private readonly useCase: ReserveStockUseCase;


    constructor(
        useCase: ReserveStockUseCase
    ) {

        super();

        this.useCase = useCase;
    }


    // ==================================================
    // EXECUTE
    // ==================================================

    protected async executeImpl(

        req: RequestAuth,

        res: Response

    ): Promise<any> {

        try {

            // ============================================
            // BUILD COMMAND
            // ============================================

            const command =
                this.buildCommand(req);


            // ============================================
            // EXECUTE USE CASE
            // ============================================

            const result =
                await this.useCase.execute(
                    command
                );


            // ============================================
            // SUCCESS
            // ============================================

            return this.ok(
                res,
                result
            );

        } catch (error: any) {

            console.error(
                "RESERVE_STOCK_ERROR:",
                error
            );


            return this.fail(
                res,
                error.message ||
                "Failed to reserve stock"
            );
        }
    }


    // ==================================================
    // BUILD COMMAND
    // ==================================================

    private buildCommand(

        req: RequestAuth

    ): {

        orderId: number;

        userId: number;

    } {

        // ================================================
        // REQUEST BODY
        // ================================================

        const {
            orderId
        } = req.body;


        // ================================================
        // AUTHENTICATED USER
        // ================================================

        const user: any =
            req.user;


        // ================================================
        // VALIDATE ORDER ID
        // ================================================

        const parsedOrderId =
            Number(orderId);


        if (

            !Number.isInteger(
                parsedOrderId
            ) ||

            parsedOrderId <= 0

        ) {

            throw new Error(
                "VALID_ORDER_ID_REQUIRED"
            );
        }


        // ================================================
        // VALIDATE AUTHENTICATED USER
        // ================================================

        if (

            !user ||

            !Number.isInteger(
                Number(user.id)
            ) ||

            Number(user.id) <= 0

        ) {

            throw new Error(
                "AUTHENTICATED_USER_REQUIRED"
            );
        }


        // ================================================
        // RETURN COMMAND
        // ================================================
        //
        // IMPORTANT:
        //
        // ❌ companyId is NOT received from Frontend
        //
        // ❌ companyId is NOT hardcoded
        //
        // ❌ companyId is NOT taken from JWT
        //
        // ✅ companyId must be obtained from the Order
        //    inside ReserveStockUseCase
        //

        return {

            orderId:
                parsedOrderId,

            userId:
                Number(user.id)

        };
    }
}












































// import { Request, Response } from "express";
// import { BaseController } from "../../infra/BaseCOntroller";
// import ReserveStockUseCase from "../../useCases/InventorieUseCase/ReserveStockUseCase";
// import { RequestAuth } from "../../middleware/verifyToken";


// export default class ReserveStockController  extends BaseController
// {

//         private _useCase!:ReserveStockUseCase
//           constructor(useCase:ReserveStockUseCase)
//           {super()
//                  this._useCase  = useCase
//           }
//        protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
           

//         console.log("RESERVE FROM STOCK ")
//                      const {orderId }  = req.body ;


//                      console.log(" order is \t\t\t  ",{orderId }  , "###  \n\n\n\n ")
//                      const user = req.user

//                       console.log(" user is  ",user)
//                     try {
                        
               

//                      const command : any = this.buildCommand(req);

//                      console.log("command is \t ",command)
                     
//                      const result = await this._useCase.execute(command);
         
                    
//                      return this.ok(res, result);
         
//                     } catch (error:any) {
                        
//                     }
//        }
//        private buildCommand(req: RequestAuth): any {
        
//               const { orderId } = req.body;
//               const user :any = req.user;
      
//               //   orderId
//               if (!orderId || typeof orderId !== 'number') {
//                   throw new Error("ORDER_ID_REQUIRED: معرف الطلب مطلوب ويجب أن يكون رقماً");
//               }
      
//               return {
//                   orderId: orderId,
//                   userId: user.id,
//                   companyId: 29
//               };
//           }
// }