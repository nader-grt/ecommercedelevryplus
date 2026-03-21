 import { Request, Response, Router } from "express";

import { verifyToken } from "../../middleware/verifyToken";
import UserAddressRepo from "../../repo/userAddressRepo/UserAddressRepo";
import CreateAddressByAdminUserController from "../../controllers/UserAddress/CreateAddressByAdminUserController";
import CreateAddressByAdminUserUseCase from "../../useCases/UserAddressUseCase/CreateAddressByAdminUserUseCase";

const router = Router();

const userAddressRepo = new UserAddressRepo();
const createUserAddressUseCase = new CreateAddressByAdminUserUseCase(userAddressRepo);
const createAddressRoute = new CreateAddressByAdminUserController(createUserAddressUseCase);

router.post("/addresses", verifyToken,  (req: Request, res: Response) => {
    createAddressRoute.execute(req, res);
});

export default router;