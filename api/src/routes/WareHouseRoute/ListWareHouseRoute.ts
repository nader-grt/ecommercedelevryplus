import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import ListWareHousesUseCase from "../../useCases/WareHouseUseCase/ListWareHousesUseCase";
import ListWareHouseController from "../../controllers/WareHouse/ListWareHouseController";
import WareHouseRepo from "../../repo/WareHouseRepo/WareHouseRepo";

const router = Router();


const wareHouse = new WareHouseRepo();

const createCompanyuseCase = new ListWareHousesUseCase(wareHouse);
const listwarehouseRoute = new ListWareHouseController(createCompanyuseCase);
router.get("/warehouses", verifyToken, (req: Request, res: Response) => {
console.log("warehouseeeeeeeeeee  ")
  listwarehouseRoute.execute(req, res);
});

export default router;
