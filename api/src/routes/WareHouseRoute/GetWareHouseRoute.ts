import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";

import getWareHouseUseCase from "../../useCases/WareHouseUseCase/GetWareHouseUseCase";
import GetWareHouseController from "../../controllers/WareHouse/GetWareHouseController";
import WareHouseRepo from "../../repo/WareHouseRepo/WareHouseRepo";

const router = Router();

const wareHouse = new WareHouseRepo();

const getuseCase = new getWareHouseUseCase(wareHouse);
const getWarehouseCRoute = new GetWareHouseController(getuseCase);
router.get("/warehouses/:id", verifyToken, (req: Request, res: Response) => {
  console.log("req getwarehouse", req.body);
  getWarehouseCRoute.execute(req, res);
});

export default router;
