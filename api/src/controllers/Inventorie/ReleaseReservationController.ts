import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import { RequestAuth } from "../../middleware/verifyToken";
import InventoryReservationRepo from "../../repo/InventoryReservationRepo/InventoryReservationRepo";


export default class ReleaseReservationUseCase extends BaseController
{

          private _useCase!:ReleaseReservationUseCase
         constructor(useCase:ReleaseReservationUseCase)
         {super()
                           this._useCase  = useCase
         }
         protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
           
        
            try {
                const { reservationId, quantity } = req.body;
                const user = req.user!;
        
                if (!reservationId) return this.fail(res, "reservationId is required");
        
                // ── Resolve reservation → inventoryId ──
                const reservationRepo = new InventoryReservationRepo();
                const reservation = await reservationRepo.findById(reservationId);
        
                if (!reservation || reservation.status !== "pending") {
                    return this.fail(res, "Reservation not found or not pending");
                }
        
                // ── Call UseCase with resolved dto ──
                // const result = await this._useCase.execute(
                //     {
                //         inventoryId: reservation.inventoryId,
                //         quantity: quantity ?? reservation.quantity
                //     },
                //     user,
                    
                // );
        
                // ── Update reservation status ──
                await reservationRepo.update(
                    reservationId,
                    { status: "released" },
                    
                );
        
                return this.ok(res, {
                    success: true,
                    message: "Reservation released",
                   // data: result
                });
        
            } catch (error: any) {
                return this.fail(res, error.message);
            }
        }
}