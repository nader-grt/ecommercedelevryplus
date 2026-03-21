import { Request, Response, Router } from "express";
import UserAddressRepo from "../../repo/userAddressRepo/UserAddressRepo";

import { verifyToken } from "../../middleware/verifyToken";
import ListUserAddressByAdminUserUseCase from "../../useCases/userUseCase/ListUserAddressByAdminUserUseCase";
import ListUserAddressByAdminUserController from "../../controllers/users/ListUserAddressByAdminUserController";

const router = Router();

const addressRepo = new UserAddressRepo();

const listUserAddressByAdminUserUseCase = new ListUserAddressByAdminUserUseCase(
  addressRepo
);
const listUserAddressByAdminUserRoute =
  new ListUserAddressByAdminUserController(listUserAddressByAdminUserUseCase);

router.get("/usersAddress", verifyToken, (req: Request, res: Response) => {
    console.log("userAddress ***/// ")
  listUserAddressByAdminUserRoute.execute(req, res);
});

export default router;
