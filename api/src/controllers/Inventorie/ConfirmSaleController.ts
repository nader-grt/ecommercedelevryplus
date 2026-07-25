import { Request, Response } from "express";
import { BaseController } from "../../infra/BaseCOntroller";
import { RequestAuth } from "../../middleware/verifyToken";
import InventoryReservationRepo from "../../repo/InventoryReservationRepo/InventoryReservationRepo";
import { ConfirmSaleUseCase } from "../../useCases/InventorieUseCase/ConfirmSaleUseCase";
import sequelize from "../../dbConfig/config";

export default class ConfirmSaleController extends BaseController
{
    private _useCase: ConfirmSaleUseCase;

    constructor(useCase: ConfirmSaleUseCase) {
        super();
        this._useCase = useCase;
    }

    protected async executeImpl(req: RequestAuth, res: Response): Promise<any> {
        const transaction = await sequelize.transaction();

        try {
            const { reservationId, quantity } = req.body;
            const user = req.user!;

            if (!reservationId) {
                await transaction.rollback();
                return this.fail(res, "reservationId is required");
            }

            const reservationIdNum = parseInt(reservationId, 10);
            if (isNaN(reservationIdNum)) {
                await transaction.rollback();
                return this.fail(res, "reservationId must be a valid number");
            }

            const reservationRepo = new InventoryReservationRepo();
            const reservation = await reservationRepo.findById(reservationIdNum);

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
                reservationIdNum,
                { status: "confirmed" },
                transaction
            );

            await transaction.commit();

            return this.ok(res, {
                success: true,
                message: "Sale confirmed successfully",
                data: result
            });

        } catch (error: any) {
            await transaction.rollback();
            return this.fail(res, error.message);
        }
    }
}