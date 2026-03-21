import { Request, Response, Router } from "express";
import UserAddressRepo from "../../repo/userAddressRepo/UserAddressRepo";
import { userRepo } from "../../repo/auth/userRepo/userRepo";
import ListUserAddressByAdminUserUseCase from "../../useCases/UserAddressUseCase/ListAddressByAdminUserUseCase";
import ListUserAddressByAdminUserController from "../../controllers/UserAddress/ListAddressByAdminUserController";
import { verifyToken } from "../../middleware/verifyToken";

const router = Router();

const userAddressRepo = new UserAddressRepo();
const listuserByAdmincaseUserRepo = new userRepo();

const listUserAddressByAdminUserUseCase = new ListUserAddressByAdminUserUseCase(
  userAddressRepo,
  listuserByAdmincaseUserRepo
);
const listUserAddressByAdminUserRoute =
  new ListUserAddressByAdminUserController(listUserAddressByAdminUserUseCase);

router.get(
  "/users/:userId/addresses",
  verifyToken,
  (req: Request, res: Response) => {
    listUserAddressByAdminUserRoute.execute;
  }
);

export default router;
