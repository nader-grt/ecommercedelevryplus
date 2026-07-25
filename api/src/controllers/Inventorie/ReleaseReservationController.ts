import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import { RequestAuth } from "../../middleware/verifyToken";
import InventoryReservationRepo from "../../repo/InventoryReservationRepo/InventoryReservationRepo";

import { ReleaseReservationUseCase } from "../../useCases/InventorieUseCase/ReleaseReservationUseCase";
import sequelize from "../../dbConfig/config";

export default class ReleaseReservationController extends BaseController
{
    private _useCase: ReleaseReservationUseCase; //
    constructor(useCase: ReleaseReservationUseCase) {
        super();
        this._useCase = useCase;
    }

    protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
        const transaction = await sequelize.transaction();
    
        try {
        
            const reservationId = parseInt(req.body.reservationId, 10);
            const { quantity } = req.body;
            const user = req.user!;
    
            if (isNaN(reservationId)) {
                await transaction.rollback();
                return this.fail(res, "reservationId must be a valid number");
            }
    
            const reservationRepo = new InventoryReservationRepo();
            const reservation = await reservationRepo.findById(reservationId);
    
            console.log("reservation:", reservation);
    
            if (!reservation || reservation.status !== "pending") {
                await transaction.rollback();
                return this.fail(res, "Reservation not found or not pending");
            }
    
            const result = await this._useCase.execute(
                {
                    inventoryId: reservation.inventoryId,
                    quantity: quantity ?? reservation.quantity
                },
                user,
                transaction
            );
    
            await reservationRepo.update(
                reservationId,
                { status: "released" },
                transaction
            );
    
            await transaction.commit();
    
            return this.ok(res, {
                success: true,
                message: "Reservation released",
                data: result
            });
    
        } catch (error: any) {
            await transaction.rollback();
            return this.fail(res, error.message);
        }
    }
}