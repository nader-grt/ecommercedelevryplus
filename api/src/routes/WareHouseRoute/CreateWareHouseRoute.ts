import { Request, Response, Router } from "express";
import { verifyToken } from "../../middleware/verifyToken";
import CompanyRepo from "../../repo/CompanyRepo/CompanyRepo";
import CreatWareHouseUseCase from "../../useCases/WareHouseUseCase/CreatWareHouseUseCase";
import CreatWareHouseController from "../../controllers/WareHouse/CreatWareHouseController";
import WareHouseRepo from "../../repo/WareHouseRepo/WareHouseRepo";

const router = Router();

const company = new CompanyRepo();
const wareHouse = new WareHouseRepo();

const createuseCase = new CreatWareHouseUseCase(wareHouse, company);
const createWarehouseCRoute = new CreatWareHouseController(createuseCase);
router.post("/warehouses", verifyToken, (req: Request, res: Response) => {
  console.log("req", req.body);
  createWarehouseCRoute.execute(req, res);
});

export default router;
