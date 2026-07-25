import { Request, Response, Router } from "express";
import InventorieRepo from "../../repo/InventorieRepo/InventorieRepo";
import InventoryMovementRepo from "../../repo/MovementRepo/InventoryMovementRepo";
import { ReleaseReservationUseCase } from "../../useCases/InventorieUseCase/ReleaseReservationUseCase";
import ReleaseReservationController from "../../controllers/Inventorie/ReleaseReservationController";
import { verifyToken } from "../../middleware/verifyToken";

const router = Router();

const inventory = new InventorieRepo();
const inventoryMovmentRepo = new InventoryMovementRepo();

const useCase = new ReleaseReservationUseCase(inventory, inventoryMovmentRepo);

const releaseReservationRoute = new ReleaseReservationController(useCase);

router.post(
    "/inventories/release-reservation",
    verifyToken,
    (req: Request, res: Response) => {
        console.log("releaseReservationRoute  is \t  ################ ")
        releaseReservationRoute.execute(req, res);
    }
  );






export default router;
